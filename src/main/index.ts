import { writeFile } from 'node:fs/promises';
import { app, dialog } from 'electron';

import { createApplication } from './bootstrap/create-application';
import {
  getStartupErrorCode,
  getStartupErrorDetails,
} from './bootstrap/startup-diagnostics';

const STARTUP_SUCCESS = 'APPLICATION_INITIALIZATION_SUCCEEDED';

async function reportStartupSuccess(): Promise<void> {
  const signalPath = process.env.RUMO_STARTUP_SIGNAL_PATH;

  if (signalPath !== undefined) {
    await writeFile(signalPath, STARTUP_SUCCESS, 'utf8');
  }

  console.info(`[RUMO] ${STARTUP_SUCCESS}`);
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  void createApplication()
    .then(reportStartupSuccess)
    .catch((error: unknown) => {
      console.error(
        `[RUMO] ${getStartupErrorCode(error)}`,
        getStartupErrorDetails(error),
      );

      if (app.isPackaged) {
        dialog.showErrorBox(
          'RUMO',
          'Não foi possível iniciar o aplicativo. Feche o RUMO e tente novamente.',
        );
      }

      app.exit(1);
    });
}
