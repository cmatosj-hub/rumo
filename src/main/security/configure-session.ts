import type { Session } from 'electron';

export function configureSecureSession(applicationSession: Session): void {
  applicationSession.setPermissionCheckHandler(() => false);
  applicationSession.setPermissionRequestHandler(
    (_webContents, _permission, callback) => {
      callback(false);
    },
  );
}
