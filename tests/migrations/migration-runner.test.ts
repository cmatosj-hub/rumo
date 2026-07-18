import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import { createDatabaseClient } from '../../src/shared/infrastructure/database/create-database-client';
import { runMigrations } from '../../src/shared/infrastructure/database/migrations/migration-runner';

const temporaryDirectories: string[] = [];
const migrationsDirectory = path.resolve('prisma/migrations');
const userId = '018f7c00-0000-7000-8000-000000000001';
const settingsId = '018f7c00-0000-7000-8000-000000000002';
const auditId = '018f7c00-0000-7000-8000-000000000003';
const correlationId = '018f7c00-0000-7000-8000-000000000004';
const timestamp = '2026-07-17T12:00:00.000+00:00';

async function createTemporaryDatabasePath(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'rumo-migration-'));
  temporaryDirectories.push(directory);
  return path.join(directory, 'data', 'rumo.db');
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

describe('runner de migrations', () => {
  it('aplica a fundação uma única vez, com checksum e integridade ativos', async () => {
    const databasePath = await createTemporaryDatabasePath();
    const firstResult = await runMigrations({
      databasePath,
      migrationsDirectory,
      now: () => new Date('2026-07-17T12:00:00.000Z'),
    });
    const secondResult = await runMigrations({
      databasePath,
      migrationsDirectory,
    });

    expect(firstResult.appliedMigrationIds).toEqual([
      '20260717220000_foundation',
    ]);
    expect(firstResult.backupPath).toBeNull();
    expect(secondResult.appliedMigrationIds).toEqual([]);
    expect(secondResult.backupPath).toBeNull();

    const database = new Database(databasePath, { fileMustExist: true });
    try {
      database.pragma('foreign_keys = ON');
      const tables = database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
        )
        .all() as { name: string }[];
      const history = database
        .prepare('SELECT id, checksum FROM _rumo_migrations')
        .get() as { checksum: string; id: string };
      const indexes = database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_autoindex%' ORDER BY name",
        )
        .all() as { name: string }[];

      expect(tables.map(({ name }) => name)).toEqual([
        '_rumo_migrations',
        'audit_log',
        'local_users',
        'user_settings',
      ]);
      expect(history.id).toBe('20260717220000_foundation');
      expect(history.checksum).toMatch(/^[a-f0-9]{64}$/);
      expect(indexes.map(({ name }) => name)).toEqual([
        'audit_log_correlation_id_idx',
        'audit_log_entity_idx',
        'audit_log_user_occurred_at_idx',
        'user_settings_user_id_key',
      ]);
      expect(database.pragma('foreign_keys', { simple: true })).toBe(1);
      expect(database.pragma('integrity_check', { simple: true })).toBe('ok');
      expect(database.pragma('foreign_key_check')).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('impõe relação 1:1, FK e auditoria append-only sem dados artificiais', async () => {
    const databasePath = await createTemporaryDatabasePath();
    await runMigrations({ databasePath, migrationsDirectory });
    const database = new Database(databasePath, { fileMustExist: true });

    try {
      database.pragma('foreign_keys = ON');
      expect(
        database.prepare('SELECT count(*) FROM local_users').pluck().get(),
      ).toBe(0);

      database
        .prepare(
          'INSERT INTO local_users (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
        )
        .run(userId, 'Usuário local', timestamp, timestamp);
      database
        .prepare(
          'INSERT INTO user_settings (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
        )
        .run(settingsId, userId, timestamp, timestamp);

      expect(() =>
        database
          .prepare(
            'INSERT INTO user_settings (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
          )
          .run(auditId, userId, timestamp, timestamp),
      ).toThrow();
      expect(() =>
        database
          .prepare(
            'INSERT INTO user_settings (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
          )
          .run(
            auditId,
            '018f7c00-0000-7000-8000-000000000099',
            timestamp,
            timestamp,
          ),
      ).toThrow();

      database
        .prepare(
          `INSERT INTO audit_log (
            id, user_id, entity, entity_id, action, actor_type, occurred_at,
            next_values_json, correlation_id, source
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          auditId,
          userId,
          'LocalUser',
          userId,
          'CREATE',
          'LOCAL_USER',
          timestamp,
          '{"version":1,"name":"Usuário local"}',
          correlationId,
          'migration-test',
        );

      expect(() =>
        database
          .prepare('UPDATE audit_log SET reason = ? WHERE id = ?')
          .run('alteração indevida', auditId),
      ).toThrow(/AUDIT_APPEND_ONLY/);
      expect(() =>
        database.prepare('DELETE FROM audit_log WHERE id = ?').run(auditId),
      ).toThrow(/AUDIT_APPEND_ONLY/);
    } finally {
      database.close();
    }
  });

  it('é compatível com a representação DateTime do adapter Prisma', async () => {
    const databasePath = await createTemporaryDatabasePath();
    await runMigrations({ databasePath, migrationsDirectory });
    const client = await createDatabaseClient(databasePath);

    try {
      const instant = new Date('2026-07-17T12:00:00.000Z');
      await client.localUser.create({
        data: {
          createdAt: instant,
          id: userId,
          name: 'Usuário via Prisma',
          updatedAt: instant,
        },
      });

      await expect(client.localUser.count()).resolves.toBe(1);
    } finally {
      await client.$disconnect();
    }
  });
});
