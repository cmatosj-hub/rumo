import type { IpcMainInvokeEvent, WebContents } from 'electron';
import { v7 as uuidV7 } from 'uuid';
import { describe, expect, it } from 'vitest';

import { createFoundationDiagnosticHandler } from '../../src/main/ipc/register-foundation-ipc';
import {
  FOUNDATION_IPC_ALLOWLIST,
  FOUNDATION_IPC_CHANNELS,
  foundationDiagnosticRequestSchema,
  foundationDiagnosticResponseSchema,
} from '../../src/shared/contracts';

function createTrustedContext(url = 'file:///rumo/index.html'): {
  readonly event: IpcMainInvokeEvent;
  readonly webContents: WebContents;
} {
  const mainFrame = { url };
  const webContents = {
    getURL: () => url,
    id: 7,
    mainFrame,
  } as unknown as WebContents;
  const event = {
    sender: webContents,
    senderFrame: mainFrame,
  } as unknown as IpcMainInvokeEvent;

  return { event, webContents };
}

function createHandler(webContents: WebContents) {
  return createFoundationDiagnosticHandler({
    applicationVersion: '0.1.0',
    clock: { now: () => new Date('2026-07-14T12:00:00.000Z') },
    electronVersion: '43.1.0',
    getTrustedWebContents: () => webContents,
    identifierGenerator: { generate: () => uuidV7() },
    nodeVersion: '24.0.0',
  });
}

describe('contrato IPC fundacional', () => {
  it('mantém uma allowlist com um único canal específico', () => {
    expect(FOUNDATION_IPC_ALLOWLIST).toEqual([
      FOUNDATION_IPC_CHANNELS.diagnosticsCheck,
    ]);
  });

  it('rejeita propriedades extras no payload', () => {
    expect(() =>
      foundationDiagnosticRequestSchema.parse({
        channel: 'arbitrary',
        correlationId: uuidV7(),
      }),
    ).toThrow();
  });

  it('retorna diagnóstico validado para sender autorizado', async () => {
    const context = createTrustedContext();
    const correlationId = uuidV7();
    const response = await createHandler(context.webContents)(context.event, {
      correlationId,
    });

    expect(foundationDiagnosticResponseSchema.parse(response)).toEqual({
      data: {
        applicationVersion: '0.1.0',
        correlationId,
        electronVersion: '43.1.0',
        nodeVersion: '24.0.0',
        status: 'ready',
        timestampUtc: '2026-07-14T12:00:00.000Z',
      },
      ok: true,
    });
  });

  it('nega sender diferente do webContents confiável', async () => {
    const trusted = createTrustedContext();
    const untrusted = createTrustedContext('file:///outro/index.html');
    const response = await createHandler(trusted.webContents)(untrusted.event, {
      correlationId: uuidV7(),
    });

    expect(response).toMatchObject({
      error: { code: 'UNAUTHORIZED_IPC_SENDER' },
      ok: false,
    });
  });
});
