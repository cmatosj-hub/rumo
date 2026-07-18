import type { IpcMain, IpcMainInvokeEvent, WebContents } from 'electron';

import { DailyClosingDateConflictError } from '../../modules/daily-closing/application/daily-closing-errors';
import { DailyClosingValidationError } from '../../modules/daily-closing/domain/daily-closing';
import {
  DAILY_CLOSING_IPC_CHANNELS,
  createDailyClosingRequestSchema,
  createDailyClosingResponseSchema,
  listDailyClosingsRequestSchema,
  listDailyClosingsResponseSchema,
  type CreateDailyClosingResponse,
  type DailyClosingInput,
  type DailyClosingRecord,
  type ListDailyClosingsResponse,
} from '../../shared/contracts';
import type { ErrorCode } from '../../shared/contracts/error-codes';
import type { IdentifierGenerator } from '../../shared/domain/identifier-generator';
import { isTrustedIpcSender } from '../security/sender-policy';

interface DailyClosingIpcDependencies {
  readonly createClosing: (
    closing: DailyClosingInput,
    correlationId: string,
  ) => Promise<DailyClosingRecord>;
  readonly getTrustedWebContents: () => WebContents | null;
  readonly identifierGenerator: IdentifierGenerator;
  readonly listClosings: () => Promise<DailyClosingRecord[]>;
}

function errorDetails(error: unknown): {
  readonly code: ErrorCode;
  readonly message: string;
} {
  if (error instanceof DailyClosingDateConflictError) {
    return {
      code: 'DAILY_CLOSING_DATE_CONFLICT',
      message:
        'Já existe um fechamento para esta data. A edição será disponibilizada em uma entrega futura.',
    };
  }

  if (error instanceof DailyClosingValidationError) {
    return {
      code: 'DAILY_CLOSING_INVALID',
      message: 'Revise os dados informados antes de salvar o fechamento.',
    };
  }

  return {
    code: 'DAILY_CLOSING_PERSISTENCE_FAILED',
    message: 'Não foi possível acessar os fechamentos. Tente novamente.',
  };
}

function failure(
  dependencies: DailyClosingIpcDependencies,
  code: ErrorCode,
  message: string,
  correlationId = dependencies.identifierGenerator.generate(),
): {
  readonly error: {
    readonly code: ErrorCode;
    readonly correlationId: string;
    readonly message: string;
  };
  readonly ok: false;
} {
  return {
    error: {
      code,
      correlationId,
      message,
    },
    ok: false,
  };
}

export function createDailyClosingCreateHandler(
  dependencies: DailyClosingIpcDependencies,
): (
  event: IpcMainInvokeEvent,
  payload: unknown,
) => Promise<CreateDailyClosingResponse> {
  return async (event, payload) => {
    if (!isTrustedIpcSender(event, dependencies.getTrustedWebContents())) {
      return createDailyClosingResponseSchema.parse(
        failure(
          dependencies,
          'UNAUTHORIZED_IPC_SENDER',
          'Solicitação IPC não autorizada.',
        ),
      );
    }

    const request = createDailyClosingRequestSchema.safeParse(payload);
    if (!request.success) {
      return createDailyClosingResponseSchema.parse(
        failure(
          dependencies,
          'INVALID_IPC_PAYLOAD',
          'Os dados enviados para o fechamento são inválidos.',
        ),
      );
    }

    try {
      const record = await dependencies.createClosing(
        request.data.closing,
        request.data.correlationId,
      );
      return createDailyClosingResponseSchema.parse({ data: record, ok: true });
    } catch (error: unknown) {
      const details = errorDetails(error);
      return createDailyClosingResponseSchema.parse(
        failure(
          dependencies,
          details.code,
          details.message,
          request.data.correlationId,
        ),
      );
    }
  };
}

export function createDailyClosingListHandler(
  dependencies: DailyClosingIpcDependencies,
): (
  event: IpcMainInvokeEvent,
  payload: unknown,
) => Promise<ListDailyClosingsResponse> {
  return async (event, payload) => {
    if (!isTrustedIpcSender(event, dependencies.getTrustedWebContents())) {
      return listDailyClosingsResponseSchema.parse(
        failure(
          dependencies,
          'UNAUTHORIZED_IPC_SENDER',
          'Solicitação IPC não autorizada.',
        ),
      );
    }

    const request = listDailyClosingsRequestSchema.safeParse(payload);
    if (!request.success) {
      return listDailyClosingsResponseSchema.parse(
        failure(
          dependencies,
          'INVALID_IPC_PAYLOAD',
          'A consulta de fechamentos é inválida.',
        ),
      );
    }

    try {
      const records = await dependencies.listClosings();
      return listDailyClosingsResponseSchema.parse({ data: records, ok: true });
    } catch (error: unknown) {
      const details = errorDetails(error);
      return listDailyClosingsResponseSchema.parse(
        failure(
          dependencies,
          details.code,
          details.message,
          request.data.correlationId,
        ),
      );
    }
  };
}

export function registerDailyClosingIpc(
  ipcMain: IpcMain,
  dependencies: DailyClosingIpcDependencies,
): () => void {
  ipcMain.handle(
    DAILY_CLOSING_IPC_CHANNELS.create,
    createDailyClosingCreateHandler(dependencies),
  );
  ipcMain.handle(
    DAILY_CLOSING_IPC_CHANNELS.list,
    createDailyClosingListHandler(dependencies),
  );

  return () => {
    ipcMain.removeHandler(DAILY_CLOSING_IPC_CHANNELS.create);
    ipcMain.removeHandler(DAILY_CLOSING_IPC_CHANNELS.list);
  };
}
