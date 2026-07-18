import { app } from 'electron';

import { createApplication } from './bootstrap/create-application';

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  void createApplication().catch(() => {
    app.exit(1);
  });
}
