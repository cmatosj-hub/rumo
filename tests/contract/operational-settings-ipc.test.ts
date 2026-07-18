import type { IpcMainInvokeEvent, WebContents } from 'electron';
import { v7 as uuidV7 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import {
  createGetOperationalSettingsHandler,
  createUpdateOperationalSettingsHandler,
} from '../../src/main/ipc/register-operational-settings-ipc';
import {
  OPERATIONAL_SETTINGS_IPC_ALLOWLIST,
  OPERATIONAL_SETTINGS_IPC_CHANNELS,
} from '../../src/shared/contracts';

function context() {
  const url = 'file:///rumo/index.html';
  const mainFrame = { url };
  const webContents = {
    getURL: () => url,
    id: 10,
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
function dependencies() {
  const trusted = context();
  return {
    trusted,
    dependencies: {
      clock: { now: () => new Date('2026-07-18T12:00:00.000Z') },
      getTrustedWebContents: () => trusted.webContents,
      identifierGenerator: { generate: () => uuidV7() },
      repository: {
        get: vi.fn().mockResolvedValue({
          minimumHourlyRateCents: null,
          monthlyGoalCents: null,
          updatedAtUtc: null,
          weeklyGoalCents: null,
          weekStartsOn: 1,
        }),
        update: vi.fn().mockImplementation(async (input) => ({
          ...input.settings,
          updatedAtUtc: '2026-07-18T12:00:00.000Z',
        })),
      },
    },
  };
}

describe('contrato IPC de preferências operacionais', () => {
  it('mantém allowlist somente de consulta e atualização', () => {
    expect(OPERATIONAL_SETTINGS_IPC_ALLOWLIST).toEqual([
      OPERATIONAL_SETTINGS_IPC_CHANNELS.get,
      OPERATIONAL_SETTINGS_IPC_CHANNELS.update,
    ]);
  });
  it('consulta preferências pelo sender confiável', async () => {
    const setup = dependencies();
    await expect(
      createGetOperationalSettingsHandler(setup.dependencies)(
        setup.trusted.event,
        { correlationId: uuidV7() },
      ),
    ).resolves.toMatchObject({ data: { weekStartsOn: 1 }, ok: true });
  });
  it('valida e encaminha a atualização', async () => {
    const setup = dependencies();
    const settings = {
      minimumHourlyRateCents: 3_000,
      monthlyGoalCents: null,
      weeklyGoalCents: 150_000,
      weekStartsOn: 1,
    };
    await expect(
      createUpdateOperationalSettingsHandler(setup.dependencies)(
        setup.trusted.event,
        { correlationId: uuidV7(), settings },
      ),
    ).resolves.toMatchObject({ data: settings, ok: true });
    expect(setup.dependencies.repository.update).toHaveBeenCalledTimes(1);
  });
  it('rejeita meta inválida antes do repositório', async () => {
    const setup = dependencies();
    const response = await createUpdateOperationalSettingsHandler(
      setup.dependencies,
    )(setup.trusted.event, {
      correlationId: uuidV7(),
      settings: {
        minimumHourlyRateCents: null,
        monthlyGoalCents: null,
        weeklyGoalCents: 0,
        weekStartsOn: 1,
      },
    });
    expect(response).toMatchObject({
      error: { code: 'INVALID_IPC_PAYLOAD' },
      ok: false,
    });
    expect(setup.dependencies.repository.update).not.toHaveBeenCalled();
  });
});
