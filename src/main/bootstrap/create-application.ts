import { app, ipcMain, session, type BrowserWindow } from 'electron';

import { SystemClock } from '../../shared/infrastructure/system-clock';
import { UuidV7Generator } from '../../shared/infrastructure/uuid-v7-generator';
import { registerFoundationIpc } from '../ipc/register-foundation-ipc';
import { configureSecureSession } from '../security/configure-session';
import { createMainWindow } from '../windows/create-main-window';

export async function createApplication(): Promise<void> {
  await app.whenReady();

  configureSecureSession(session.defaultSession);

  const spikeUserDataPath = process.env.RUMO_DATABASE_SPIKE_USER_DATA;
  let disconnectDatabaseClient: (() => Promise<void>) | null = null;

  if (spikeUserDataPath !== undefined) {
    const [{ createDatabaseClient }, { resolveDatabasePath }] =
      await Promise.all([
        import('../../shared/infrastructure/database/create-database-client'),
        import('../../shared/infrastructure/database/database-path'),
      ]);
    const databaseClient = await createDatabaseClient(
      resolveDatabasePath(spikeUserDataPath),
    );

    disconnectDatabaseClient = async () => databaseClient.$disconnect();
  }

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
