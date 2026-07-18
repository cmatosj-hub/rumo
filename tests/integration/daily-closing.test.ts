// @vitest-environment node

import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createDailyClosing } from '../../src/modules/daily-closing/application/create-daily-closing';
import { DailyClosingDateConflictError } from '../../src/modules/daily-closing/application/daily-closing-errors';
import { listDailyClosings } from '../../src/modules/daily-closing/application/list-daily-closings';
import { PrismaDailyClosingRepository } from '../../src/modules/daily-closing/infrastructure/prisma-daily-closing-repository';
import type { DailyClosingInput } from '../../src/shared/contracts';
import { createDatabaseClient } from '../../src/shared/infrastructure/database/create-database-client';
import { runMigrations } from '../../src/shared/infrastructure/database/migrations/migration-runner';

const temporaryDirectories: string[] = [];
const migrationsDirectory = path.resolve('prisma/migrations');

const closingInput: DailyClosingInput = {
  finalOdometerMeters: 130_500,
  foodExpenseCents: 1_250,
  fuelExpenseCents: 8_000,
  initialOdometerMeters: 100_000,
  maintenanceExpenseCents: 0,
  ninetyNineEarningsCents: 12_345,
  notes: 'Dia produtivo',
  operationalDate: '2026-07-18',
  otherExpensesCents: 500,
  parkingExpenseCents: 1_000,
  tollExpenseCents: 750,
  uberEarningsCents: 23_456,
  workedSeconds: 28_800,
};

const identifiers = [
  '018f7c00-0000-7000-8000-000000000101',
  '018f7c00-0000-7000-8000-000000000102',
  '018f7c00-0000-7000-8000-000000000103',
  '018f7c00-0000-7000-8000-000000000104',
  '018f7c00-0000-7000-8000-000000000105',
  '018f7c00-0000-7000-8000-000000000106',
  '018f7c00-0000-7000-8000-000000000107',
  '018f7c00-0000-7000-8000-000000000108',
] as const;
const correlationId = '018f7c00-0000-7000-8000-000000000199';

async function createScenario() {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'rumo-closing-'));
  temporaryDirectories.push(directory);
  const databasePath = path.join(directory, 'data', 'rumo.db');
  await runMigrations({ databasePath, migrationsDirectory });
  const client = await createDatabaseClient(databasePath);
  let identifierIndex = 0;

  return {
    client,
    databasePath,
    dependencies: {
      clock: { now: () => new Date('2026-07-18T12:00:00.000Z') },
      identifierGenerator: {
        generate: () => identifiers[identifierIndex++] ?? identifiers[7],
      },
      repository: new PrismaDailyClosingRepository(client),
    },
  };
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

describe('persistência do fechamento diário', () => {
  it('cria, lê e preserva todos os valores após reabrir o banco', async () => {
    const scenario = await createScenario();
    const created = await createDailyClosing(
      scenario.dependencies,
      closingInput,
      correlationId,
    );

    expect(created).toMatchObject({
      ...closingInput,
      summary: {
        distanceMeters: 30_500,
        netResultCents: 24_301,
        totalEarningsCents: 35_801,
        totalExpensesCents: 11_500,
      },
    });

    await scenario.client.$disconnect();
    const reopenedClient = await createDatabaseClient(scenario.databasePath);
    try {
      const records = await listDailyClosings(
        new PrismaDailyClosingRepository(reopenedClient),
      );
      expect(records).toHaveLength(1);
      expect(records[0]).toMatchObject(closingInput);
      await expect(
        reopenedClient.auditLog.findFirst({
          where: { entity: 'DailyClosing', entityId: created.id },
        }),
      ).resolves.toMatchObject({
        action: 'CREATE',
        correlationId,
        operationalDate: closingInput.operationalDate,
      });
    } finally {
      await reopenedClient.$disconnect();
    }
  });

  it('ordena por data da mais recente para a mais antiga', async () => {
    const scenario = await createScenario();
    try {
      await createDailyClosing(
        scenario.dependencies,
        {
          ...closingInput,
          operationalDate: '2026-07-17',
        },
        correlationId,
      );
      await createDailyClosing(
        scenario.dependencies,
        closingInput,
        correlationId,
      );

      const records = await listDailyClosings(scenario.dependencies.repository);
      expect(records.map((record) => record.operationalDate)).toEqual([
        '2026-07-18',
        '2026-07-17',
      ]);
    } finally {
      await scenario.client.$disconnect();
    }
  });

  it('impede duplicidade da data e mantém apenas o primeiro registro', async () => {
    const scenario = await createScenario();
    try {
      await createDailyClosing(
        scenario.dependencies,
        closingInput,
        correlationId,
      );
      await expect(
        createDailyClosing(scenario.dependencies, closingInput, correlationId),
      ).rejects.toBeInstanceOf(DailyClosingDateConflictError);
      await expect(
        listDailyClosings(scenario.dependencies.repository),
      ).resolves.toHaveLength(1);
    } finally {
      await scenario.client.$disconnect();
    }
  });
});
