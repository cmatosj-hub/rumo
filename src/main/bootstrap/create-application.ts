import { app, ipcMain, session, type BrowserWindow } from 'electron';

import { createDailyClosing } from '../../modules/daily-closing/application/create-daily-closing';
import { listDailyClosings } from '../../modules/daily-closing/application/list-daily-closings';
import { PrismaDailyClosingRepository } from '../../modules/daily-closing/infrastructure/prisma-daily-closing-repository';
import { SystemClock } from '../../shared/infrastructure/system-clock';
import { UuidV7Generator } from '../../shared/infrastructure/uuid-v7-generator';
import { registerDailyClosingIpc } from '../ipc/register-daily-closing-ipc';
import { registerFoundationIpc } from '../ipc/register-foundation-ipc';
import { configureSecureSession } from '../security/configure-session';
import { createMainWindow } from '../windows/create-main-window';

export async function createApplication(): Promise<void> {
  await app.whenReady();

  configureSecureSession(session.defaultSession);

  const [
    { createDatabaseClient },
    { resolveDatabasePath },
    { resolveMigrationsDirectory },
    { runMigrations },
  ] = await Promise.all([
    import('../../shared/infrastructure/database/create-database-client'),
    import('../../shared/infrastructure/database/database-path'),
    import('../../shared/infrastructure/database/migrations/migration-path'),
    import('../../shared/infrastructure/database/migrations/migration-runner'),
  ]);
  const userDataPath =
    process.env.RUMO_E2E_USER_DATA_PATH ?? app.getPath('userData');
  const databasePath = resolveDatabasePath(userDataPath);

  await runMigrations({
    databasePath,
    migrationsDirectory: resolveMigrationsDirectory({
      isPackaged: app.isPackaged,
      projectRoot: process.cwd(),
      resourcesPath: process.resourcesPath,
    }),
  });

  const databaseClient = await createDatabaseClient(databasePath);
  let disconnectDatabaseClient: (() => Promise<void>) | null = async () =>
    databaseClient.$disconnect();

  const clock = new SystemClock();
  const identifierGenerator = new UuidV7Generator();
  const dailyClosingRepository = new PrismaDailyClosingRepository(
    databaseClient,
  );
  let mainWindow: BrowserWindow | null = await createMainWindow();
  const unregisterFoundationIpc = registerFoundationIpc(ipcMain, {
    applicationVersion: app.getVersion(),
    clock,
    electronVersion: process.versions.electron,
    getTrustedWebContents: () => mainWindow?.webContents ?? null,
    identifierGenerator,
    nodeVersion: process.versions.node,
  });
  const unregisterDailyClosingIpc = registerDailyClosingIpc(ipcMain, {
    createClosing: async (closing, correlationId) =>
      createDailyClosing(
        { clock, identifierGenerator, repository: dailyClosingRepository },
        closing,
        correlationId,
      ),
    getTrustedWebContents: () => mainWindow?.webContents ?? null,
    identifierGenerator,
    listClosings: async () => listDailyClosings(dailyClosingRepository),
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  app.on('second-instance', () => {
    if (mainWindow === null) {
      return;
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.focus();
  });

  let shutdownStarted = false;

  app.on('before-quit', (event) => {
    unregisterFoundationIpc();
    unregisterDailyClosingIpc();

    if (disconnectDatabaseClient === null || shutdownStarted) {
      return;
    }

    event.preventDefault();
    shutdownStarted = true;

    void disconnectDatabaseClient().finally(() => {
      disconnectDatabaseClient = null;
      app.quit();
    });
  });

  app.on('window-all-closed', () => {
    app.quit();
  });
}
