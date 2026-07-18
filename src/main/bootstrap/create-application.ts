import { app, ipcMain, session, type BrowserWindow } from 'electron';

import { SystemClock } from '../../shared/infrastructure/system-clock';
import { UuidV7Generator } from '../../shared/infrastructure/uuid-v7-generator';
import { registerFoundationIpc } from '../ipc/register-foundation-ipc';
import { configureSecureSession } from '../security/configure-session';
import { createMainWindow } from '../windows/create-main-window';

export async function createApplication(): Promise<void> {
  await app.whenReady();

  configureSecureSession(session.defaultSession);

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

  app.once('before-quit', () => {
    unregisterFoundationIpc();
  });

  app.on('window-all-closed', () => {
    app.quit();
  });
}
