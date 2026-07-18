import type { IpcMain, IpcMainInvokeEvent, WebContents } from 'electron';

import type { OperationalSettingsRepository } from '../../modules/operational-settings/application/operational-settings-repository';
import { getOperationalSettings } from '../../modules/operational-settings/application/get-operational-settings';
import { updateOperationalSettings } from '../../modules/operational-settings/application/update-operational-settings';
import {
  getOperationalSettingsRequestSchema,
  getOperationalSettingsResponseSchema,
  OPERATIONAL_SETTINGS_IPC_CHANNELS,
  updateOperationalSettingsRequestSchema,
  updateOperationalSettingsResponseSchema,
  type GetOperationalSettingsResponse,
  type UpdateOperationalSettingsResponse,
} from '../../shared/contracts';
import type { Clock } from '../../shared/domain/clock';
import type { IdentifierGenerator } from '../../shared/domain/identifier-generator';
import { isTrustedIpcSender } from '../security/sender-policy';

interface Dependencies {
  readonly clock: Clock;
  readonly getTrustedWebContents: () => WebContents | null;
  readonly identifierGenerator: IdentifierGenerator;
  readonly repository: OperationalSettingsRepository;
}

function failure(
  dependencies: Dependencies,
  code:
    | 'INVALID_IPC_PAYLOAD'
    | 'UNAUTHORIZED_IPC_SENDER'
    | 'OPERATIONAL_SETTINGS_PERSISTENCE_FAILED',
  message: string,
  correlationId = dependencies.identifierGenerator.generate(),
) {
  return { error: { code, correlationId, message }, ok: false } as const;
}

export function createGetOperationalSettingsHandler(
  dependencies: Dependencies,
) {
  return async (
    event: IpcMainInvokeEvent,
    payload: unknown,
  ): Promise<GetOperationalSettingsResponse> => {
    if (!isTrustedIpcSender(event, dependencies.getTrustedWebContents())) {
      return getOperationalSettingsResponseSchema.parse(
        failure(
          dependencies,
          'UNAUTHORIZED_IPC_SENDER',
          'Solicitação IPC não autorizada.',
        ),
      );
    }
    const request = getOperationalSettingsRequestSchema.safeParse(payload);
    if (!request.success) {
      return getOperationalSettingsResponseSchema.parse(
        failure(
          dependencies,
          'INVALID_IPC_PAYLOAD',
          'A consulta de configurações é inválida.',
        ),
      );
    }
    try {
      return getOperationalSettingsResponseSchema.parse({
        data: await getOperationalSettings(dependencies.repository),
        ok: true,
      });
    } catch {
      return getOperationalSettingsResponseSchema.parse(
        failure(
          dependencies,
          'OPERATIONAL_SETTINGS_PERSISTENCE_FAILED',
          'Não foi possível consultar as configurações.',
          request.data.correlationId,
        ),
      );
    }
  };
}

export function createUpdateOperationalSettingsHandler(
  dependencies: Dependencies,
) {
  return async (
    event: IpcMainInvokeEvent,
    payload: unknown,
  ): Promise<UpdateOperationalSettingsResponse> => {
    if (!isTrustedIpcSender(event, dependencies.getTrustedWebContents())) {
      return updateOperationalSettingsResponseSchema.parse(
        failure(
          dependencies,
          'UNAUTHORIZED_IPC_SENDER',
          'Solicitação IPC não autorizada.',
        ),
      );
    }
    const request = updateOperationalSettingsRequestSchema.safeParse(payload);
    if (!request.success) {
      return updateOperationalSettingsResponseSchema.parse(
        failure(
          dependencies,
          'INVALID_IPC_PAYLOAD',
          'Revise os valores das configurações.',
        ),
      );
    }
    try {
      return updateOperationalSettingsResponseSchema.parse({
        data: await updateOperationalSettings(
          dependencies,
          request.data.settings,
          request.data.correlationId,
        ),
        ok: true,
      });
    } catch {
      return updateOperationalSettingsResponseSchema.parse(
        failure(
          dependencies,
          'OPERATIONAL_SETTINGS_PERSISTENCE_FAILED',
          'Não foi possível salvar as configurações.',
          request.data.correlationId,
        ),
      );
    }
  };
}

export function registerOperationalSettingsIpc(
  ipcMain: IpcMain,
  dependencies: Dependencies,
): () => void {
  ipcMain.handle(
    OPERATIONAL_SETTINGS_IPC_CHANNELS.get,
    createGetOperationalSettingsHandler(dependencies),
  );
  ipcMain.handle(
    OPERATIONAL_SETTINGS_IPC_CHANNELS.update,
    createUpdateOperationalSettingsHandler(dependencies),
  );
  return () => {
    ipcMain.removeHandler(OPERATIONAL_SETTINGS_IPC_CHANNELS.get);
    ipcMain.removeHandler(OPERATIONAL_SETTINGS_IPC_CHANNELS.update);
  };
}
