import type { IpcMainInvokeEvent, WebContents } from 'electron';
import { v7 as uuidV7 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';

import {
  createDailyClosingCreateHandler,
  createDailyClosingListHandler,
} from '../../src/main/ipc/register-daily-closing-ipc';
import {
  DAILY_CLOSING_IPC_ALLOWLIST,
  DAILY_CLOSING_IPC_CHANNELS,
  type DailyClosingInput,
  type DailyClosingRecord,
} from '../../src/shared/contracts';

const closing: DailyClosingInput = {
  finalOdometerMeters: 120_000,
  foodExpenseCents: 0,
  fuelExpenseCents: 2_000,
  initialOdometerMeters: 100_000,
  maintenanceExpenseCents: 0,
  ninetyNineEarningsCents: 5_000,
  notes: null,
  operationalDate: '2026-07-18',
  otherExpensesCents: 0,
  parkingExpenseCents: 0,
  tollExpenseCents: 0,
  uberEarningsCents: 10_000,
  workedSeconds: 18_000,
};

const record: DailyClosingRecord = {
  ...closing,
  createdAtUtc: '2026-07-18T12:00:00.000Z',
  id: '018f7c00-0000-7000-8000-000000000201',
  summary: {
    distanceMeters: 20_000,
    grossPerHourCents: 3_000,
    netPerHourCents: 2_600,
    netResultCents: 13_000,
    totalEarningsCents: 15_000,
    totalExpensesCents: 2_000,
  },
  updatedAtUtc: '2026-07-18T12:00:00.000Z',
};

function createTrustedContext(): {
  readonly event: IpcMainInvokeEvent;
  readonly webContents: WebContents;
} {
  const url = 'file:///rumo/index.html';
  const mainFrame = { url };
  const webContents = {
    getURL: () => url,
    id: 9,
    mainFrame,
  } as unknown as WebContents;
  return {
    event: {
      sender: webContents,
      senderFrame: mainFrame,
    } as unknown as IpcMainInvokeEvent,
    webContents,
  };
}

describe('contrato IPC de fechamento diário', () => {
  it('expõe somente os canais específicos de criação e consulta', () => {
    expect(DAILY_CLOSING_IPC_ALLOWLIST).toEqual([
      DAILY_CLOSING_IPC_CHANNELS.create,
      DAILY_CLOSING_IPC_CHANNELS.list,
    ]);
  });

  it('valida o payload e encaminha a criação para o caso de uso', async () => {
    const context = createTrustedContext();
    const createClosing = vi.fn().mockResolvedValue(record);
    const handler = createDailyClosingCreateHandler({
      createClosing,
      getTrustedWebContents: () => context.webContents,
      identifierGenerator: { generate: () => uuidV7() },
      listClosings: vi.fn(),
    });
    const correlationId = uuidV7();
    const response = await handler(context.event, {
      closing,
      correlationId,
    });

    expect(response).toEqual({ data: record, ok: true });
    expect(createClosing).toHaveBeenCalledWith(closing, correlationId);
  });

  it('rejeita payload inválido antes de chamar o caso de uso', async () => {
    const context = createTrustedContext();
    const createClosing = vi.fn();
    const handler = createDailyClosingCreateHandler({
      createClosing,
      getTrustedWebContents: () => context.webContents,
      identifierGenerator: { generate: () => uuidV7() },
      listClosings: vi.fn(),
    });
    const response = await handler(context.event, {
      closing: { ...closing, uberEarningsCents: -1 },
      correlationId: uuidV7(),
    });

    expect(response).toMatchObject({
      error: { code: 'INVALID_IPC_PAYLOAD' },
      ok: false,
    });
    expect(createClosing).not.toHaveBeenCalled();
  });

  it('consulta registros sem expor repository ou banco', async () => {
    const context = createTrustedContext();
    const listClosings = vi.fn().mockResolvedValue([record]);
    const handler = createDailyClosingListHandler({
      createClosing: vi.fn(),
      getTrustedWebContents: () => context.webContents,
      identifierGenerator: { generate: () => uuidV7() },
      listClosings,
    });

    await expect(
      handler(context.event, { correlationId: uuidV7() }),
    ).resolves.toEqual({ data: [record], ok: true });
  });
});
