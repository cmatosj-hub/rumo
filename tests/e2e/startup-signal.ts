import { expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

export const STARTUP_SUCCESS = 'APPLICATION_INITIALIZATION_SUCCEEDED';

export async function waitForStartupSuccess(signalPath: string): Promise<void> {
  await expect
    .poll(
      async () => {
        try {
          return await readFile(signalPath, 'utf8');
        } catch {
          return null;
        }
      },
      {
        message: `O bootstrap não emitiu ${STARTUP_SUCCESS}.`,
        timeout: 15_000,
      },
    )
    .toBe(STARTUP_SUCCESS);
}
