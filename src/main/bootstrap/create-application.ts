import { app, ipcMain, session, type BrowserWindow } from 'electron';

import { SystemClock } from '../../shared/infrastructure/system-clock';
import { UuidV7Generator } from '../../shared/infrastructure/uuid-v7-generator';
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

  let mainWindow: BrowserWindow | null = await createMainWindow();
  const unregisterFoundationIpc = registerFoundationIpc(ipcMain, {
    applicationVersion: app.getVersion(),
    clock: new SystemClock(),
    electronVersion: process.versions.electron,
    getTrustedWebContents: () => mainWindow?.webContents ?? null,
    identifierGenerator: new UuidV7Generator(),
    nodeVersion: process.versions.node,
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
