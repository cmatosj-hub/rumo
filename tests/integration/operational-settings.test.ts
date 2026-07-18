// @vitest-environment node
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { PrismaOperationalSettingsRepository } from '../../src/modules/operational-settings/infrastructure/prisma-operational-settings-repository';
import { createDatabaseClient } from '../../src/shared/infrastructure/database/create-database-client';
import { runMigrations } from '../../src/shared/infrastructure/database/migrations/migration-runner';

const directories: string[] = [];
afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
});
describe('preferências operacionais', () => {
  it('persiste e recupera metas, mínimo por hora e início da semana', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'rumo-settings-'));
    directories.push(directory);
    const databasePath = path.join(directory, 'rumo.db');
    await runMigrations({
      databasePath,
      migrationsDirectory: path.resolve('prisma/migrations'),
    });
    const client = await createDatabaseClient(databasePath);
    const repository = new PrismaOperationalSettingsRepository(client);
    try {
      expect(await repository.get()).toMatchObject({
        weeklyGoalCents: null,
        weekStartsOn: 1,
      });
      await repository.update({
        auditId: '018f7c00-0000-7000-8000-000000000501',
        correlationId: '018f7c00-0000-7000-8000-000000000502',
        localUserId: '018f7c00-0000-7000-8000-000000000503',
        settingsId: '018f7c00-0000-7000-8000-000000000504',
        settings: {
          minimumHourlyRateCents: 3_500,
          monthlyGoalCents: 600_000,
          weeklyGoalCents: 150_000,
          weekStartsOn: 1,
        },
        timestamp: new Date('2026-07-18T12:00:00.000Z'),
      });
      expect(await repository.get()).toMatchObject({
        minimumHourlyRateCents: 3_500,
        monthlyGoalCents: 600_000,
        weeklyGoalCents: 150_000,
        weekStartsOn: 1,
      });
      expect(
        await client.auditLog.count({ where: { entity: 'UserSettings' } }),
      ).toBe(1);
    } finally {
      await client.$disconnect();
    }
  });
});
