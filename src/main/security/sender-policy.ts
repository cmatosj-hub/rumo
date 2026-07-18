import type { IpcMainInvokeEvent, WebContents } from 'electron';

import { isAllowedApplicationUrl } from './application-url';

export function isTrustedIpcSender(
  event: IpcMainInvokeEvent,
  trustedWebContents: WebContents | null,
): boolean {
  if (
    trustedWebContents === null ||
    event.sender.id !== trustedWebContents.id
  ) {
    return false;
  }

  if (
    event.senderFrame === null ||
    event.senderFrame !== event.sender.mainFrame
  ) {
    return false;
  }

  return isAllowedApplicationUrl(
    event.senderFrame.url,
    trustedWebContents.getURL(),
  );
}
