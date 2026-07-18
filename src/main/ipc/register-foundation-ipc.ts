import type { IpcMain, IpcMainInvokeEvent, WebContents } from 'electron';

import type { Clock } from '../../shared/domain/clock';
import type { IdentifierGenerator } from '../../shared/domain/identifier-generator';
import {
  FOUNDATION_IPC_CHANNELS,
  foundationDiagnosticRequestSchema,
  foundationDiagnosticResponseSchema,
  type FoundationDiagnosticResponse,
} from '../../shared/contracts/foundation-ipc';
import { isTrustedIpcSender } from '../security/sender-policy';

interface FoundationDiagnosticDependencies {
  readonly applicationVersion: string;
  readonly clock: Clock;
  readonly electronVersion: string;
  readonly getTrustedWebContents: () => WebContents | null;
  readonly identifierGenerator: IdentifierGenerator;
  readonly nodeVersion: string;
}

function failureResponse(
  dependencies: FoundationDiagnosticDependencies,
  code: 'INVALID_IPC_PAYLOAD' | 'UNAUTHORIZED_IPC_SENDER',
  message: string,
): FoundationDiagnosticResponse {
  return foundationDiagnosticResponseSchema.parse({
    error: {
      code,
      correlationId: dependencies.identifierGenerator.generate(),
      message,
    },
    ok: false,
  });
}

export function createFoundationDiagnosticHandler(
  dependencies: FoundationDiagnosticDependencies,
): (
  event: IpcMainInvokeEvent,
  payload: unknown,
) => Promise<FoundationDiagnosticResponse> {
  return async (event, payload) => {
    if (!isTrustedIpcSender(event, dependencies.getTrustedWebContents())) {
      return failureResponse(
        dependencies,
        'UNAUTHORIZED_IPC_SENDER',
        'Solicitação IPC não autorizada.',
      );
    }

    const request = foundationDiagnosticRequestSchema.safeParse(payload);
    if (!request.success) {
      return failureResponse(
        dependencies,
        'INVALID_IPC_PAYLOAD',
        'Payload de diagnóstico inválido.',
      );
    }

    return foundationDiagnosticResponseSchema.parse({
      data: {
        applicationVersion: dependencies.applicationVersion,
        correlationId: request.data.correlationId,
        electronVersion: dependencies.electronVersion,
        nodeVersion: dependencies.nodeVersion,
        status: 'ready',
        timestampUtc: dependencies.clock.now().toISOString(),
      },
      ok: true,
    });
  };
}

export function registerFoundationIpc(
  ipcMain: IpcMain,
  dependencies: FoundationDiagnosticDependencies,
): () => void {
  ipcMain.handle(
    FOUNDATION_IPC_CHANNELS.diagnosticsCheck,
    createFoundationDiagnosticHandler(dependencies),
  );

  return () => {
    ipcMain.removeHandler(FOUNDATION_IPC_CHANNELS.diagnosticsCheck);
  };
}
