import { BrowserWindow } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isAllowedApplicationUrl } from '../security/application-url';

function resolveRendererTarget(): {
  readonly expectedUrl: string;
  readonly load: (window: BrowserWindow) => Promise<void>;
} {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined) {
    const developmentUrl = MAIN_WINDOW_VITE_DEV_SERVER_URL;

    return {
      expectedUrl: developmentUrl,
      load: async (window) => window.loadURL(developmentUrl),
    };
  }

  const rendererPath = path.join(
    __dirname,
    `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
  );

  return {
    expectedUrl: pathToFileURL(rendererPath).href,
    load: async (window) => window.loadFile(rendererPath),
  };
}

export async function createMainWindow(): Promise<BrowserWindow> {
  const target = resolveRendererTarget();
  const window = new BrowserWindow({
    height: 720,
    minHeight: 600,
    minWidth: 900,
    show: false,
    title: 'RUMO',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      webSecurity: true,
    },
    width: 1120,
  });

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, navigationUrl) => {
    if (!isAllowedApplicationUrl(navigationUrl, target.expectedUrl)) {
      event.preventDefault();
    }
  });
  window.once('ready-to-show', () => {
    window.show();
  });

  await target.load(window);

  return window;
}
