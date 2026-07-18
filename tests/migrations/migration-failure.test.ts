import {
  cp,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  MIGRATION_ERROR_CODES,
  MigrationInfrastructureError,
} from '../../src/shared/infrastructure/database/migrations/migration-error';
import { runMigrations } from '../../src/shared/infrastructure/database/migrations/migration-runner';

const temporaryDirectories: string[] = [];

async function createScenario(): Promise<{
  databasePath: string;
  directory: string;
  migrationsDirectory: string;
}> {
  const directory = await mkdtemp(
    path.join(os.tmpdir(), 'rumo-migration-failure-'),
  );
  temporaryDirectories.push(directory);
  const migrationsDirectory = path.join(directory, 'migrations');
  await cp(path.resolve('prisma/migrations'), migrationsDirectory, {
    recursive: true,
  });

  return {
    databasePath: path.join(directory, 'data', 'rumo.db'),
    directory,
    migrationsDirectory,
  };
}

async function addBrokenMigration(migrationsDirectory: string): Promise<void> {
  const migrationDirectory = path.join(
    migrationsDirectory,
    '20260717220100_broken_test',
  );
  await writeFile(
    path.join(migrationDirectory, 'migration.sql'),
    'CREATE TABLE partial_change (id TEXT); INSERT INTO missing_table VALUES (1);',
    { encoding: 'utf8', flag: 'wx' },
  ).catch(async (error: unknown) => {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    const { mkdir } = await import('node:fs/promises');
    await mkdir(migrationDirectory, { recursive: true });
    await writeFile(
      path.join(migrationDirectory, 'migration.sql'),
      'CREATE TABLE partial_change (id TEXT); INSERT INTO missing_table VALUES (1);',
      'utf8',
    );
  });
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

describe('falha e recuperação de migration', () => {
  it('detecta alteração de checksum sem modificar o banco aplicado', async () => {
    const scenario = await createScenario();
    await runMigrations(scenario);
    const migrationPath = path.join(
      scenario.migrationsDirectory,
      '20260717220000_foundation',
      'migration.sql',
    );
    const sql = await readFile(migrationPath, 'utf8');
    await writeFile(migrationPath, `${sql}\n-- adulterada\n`, 'utf8');

    await expect(runMigrations(scenario)).rejects.toMatchObject({
      code: MIGRATION_ERROR_CODES.checksum,
    });

    const database = new Database(scenario.databasePath, {
      fileMustExist: true,
      readonly: true,
    });
    try {
      expect(
        database.prepare('SELECT count(*) FROM _rumo_migrations').pluck().get(),
      ).toBe(3);
    } finally {
      database.close();
    }
  });

  it('restaura banco preexistente e não deixa alteração parcial', async () => {
    const scenario = await createScenario();
    await rm(path.dirname(scenario.databasePath), {
      force: true,
      recursive: true,
    });
    const { mkdir } = await import('node:fs/promises');
    await mkdir(path.dirname(scenario.databasePath), { recursive: true });
    const original = new Database(scenario.databasePath);
    original.exec(
      "CREATE TABLE preserved (value TEXT NOT NULL); INSERT INTO preserved VALUES ('original');",
    );
    original.close();
    await addBrokenMigration(scenario.migrationsDirectory);

    let caughtError: unknown;
    try {
      await runMigrations({
        ...scenario,
        now: () => new Date('2026-07-17T12:00:00.000Z'),
      });
    } catch (error: unknown) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(MigrationInfrastructureError);
    expect(caughtError).toMatchObject({ code: MIGRATION_ERROR_CODES.apply });
    expect((caughtError as Error).message).not.toContain('missing_table');
    expect((caughtError as Error).cause).toBeInstanceOf(Error);
    expect(((caughtError as Error).cause as Error).message).toContain(
      'missing_table',
    );

    const restored = new Database(scenario.databasePath, {
      fileMustExist: true,
      readonly: true,
    });
    try {
      expect(
        restored.prepare('SELECT value FROM preserved').pluck().get(),
      ).toBe('original');
      expect(
        restored
          .prepare(
            "SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name IN ('local_users', 'partial_change')",
          )
          .pluck()
          .get(),
      ).toBe(0);
    } finally {
      restored.close();
    }

    const files = await readdir(path.dirname(scenario.databasePath));
    expect(files.filter((file) => file.endsWith('.backup'))).toHaveLength(1);
  });

  it('remove banco novo quando a aplicação falha', async () => {
    const scenario = await createScenario();
    await addBrokenMigration(scenario.migrationsDirectory);

    await expect(runMigrations(scenario)).rejects.toMatchObject({
      code: MIGRATION_ERROR_CODES.apply,
    });
    await expect(readdir(path.dirname(scenario.databasePath))).resolves.toEqual(
      [],
    );
  });
});
