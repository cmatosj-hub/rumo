import { app } from 'electron';

import { createApplication } from './bootstrap/create-application';

function getStartupErrorCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    error.code.startsWith('DATABASE_')
  ) {
    return error.code;
  }

  return 'APPLICATION_INITIALIZATION_FAILED';
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  void createApplication().catch((error: unknown) => {
    console.error(`[RUMO] ${getStartupErrorCode(error)}`);
    app.exit(1);
  });
}
