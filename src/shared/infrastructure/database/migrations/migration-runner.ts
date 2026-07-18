import { copyFile, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

import Database from 'better-sqlite3';

import {
  discoverMigrations,
  type MigrationDefinition,
} from './discover-migrations';
import {
  MIGRATION_ERROR_CODES,
  MigrationInfrastructureError,
} from './migration-error';

const MIGRATION_TABLE = '_rumo_migrations';
const FOUNDATIONAL_TABLES = ['audit_log', 'local_users', 'user_settings'];

interface AppliedMigrationRow {
  readonly checksum: string;
  readonly id: string;
}

export interface MigrationRunnerOptions {
  readonly databasePath: string;
  readonly migrationsDirectory: string;
  readonly now?: () => Date;
}

export interface MigrationRunnerResult {
  readonly appliedMigrationIds: readonly string[];
  readonly backupPath: string | null;
  readonly foreignKeysEnabled: true;
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

function migrationTableExists(database: Database.Database): boolean {
  return (
    database
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
      )
      .get(MIGRATION_TABLE) !== undefined
  );
}

function readAppliedMigrations(
  database: Database.Database,
): AppliedMigrationRow[] {
  if (!migrationTableExists(database)) {
    return [];
  }

  return database
    .prepare(`SELECT id, checksum FROM "${MIGRATION_TABLE}" ORDER BY id ASC`)
    .all() as AppliedMigrationRow[];
}

function validateMigrationHistory(
  migrations: readonly MigrationDefinition[],
  applied: readonly AppliedMigrationRow[],
): void {
  for (const [index, appliedMigration] of applied.entries()) {
    const expectedMigration = migrations[index];

    if (
      expectedMigration === undefined ||
      expectedMigration.id !== appliedMigration.id
    ) {
      throw new MigrationInfrastructureError(MIGRATION_ERROR_CODES.history);
    }

    if (expectedMigration.checksum !== appliedMigration.checksum) {
      throw new MigrationInfrastructureError(MIGRATION_ERROR_CODES.checksum);
    }
  }
}

function assertNoPartialFoundation(database: Database.Database): void {
  if (migrationTableExists(database)) {
    return;
  }

  const placeholders = FOUNDATIONAL_TABLES.map(() => '?').join(', ');
  const row = database
    .prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${placeholders}) LIMIT 1`,
    )
    .get(...FOUNDATIONAL_TABLES);

  if (row !== undefined) {
    throw new MigrationInfrastructureError(MIGRATION_ERROR_CODES.history);
  }
}

function createMigrationTable(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS "${MIGRATION_TABLE}" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "checksum" TEXT NOT NULL CHECK (length("checksum") = 64),
      "applied_at" TEXT NOT NULL,
      "technical_version" INTEGER NOT NULL DEFAULT 1 CHECK ("technical_version" >= 1)
    ) WITHOUT ROWID;
  `);
}

function validateDatabaseIntegrity(database: Database.Database): void {
  const integrityRows = database.pragma('integrity_check') as {
    integrity_check: string;
  }[];
  const foreignKeyRows = database.pragma('foreign_key_check') as unknown[];

  if (
    integrityRows.length !== 1 ||
    integrityRows[0]?.integrity_check !== 'ok' ||
    foreignKeyRows.length > 0
  ) {
    throw new MigrationInfrastructureError(MIGRATION_ERROR_CODES.integrity);
  }
}

function createBackupName(databasePath: string, now: Date): string {
  const timestamp = now.toISOString().replaceAll(/[:.]/g, '-');
  return `${databasePath}.${timestamp}.backup`;
}

async function removeDatabaseArtifacts(databasePath: string): Promise<void> {
  await Promise.all(
    ['', '-journal', '-shm', '-wal'].map(async (suffix) => {
      await rm(`${databasePath}${suffix}`, { force: true });
    }),
  );
}

export async function runMigrations(
  options: MigrationRunnerOptions,
): Promise<MigrationRunnerResult> {
  const migrations = await discoverMigrations(options.migrationsDirectory);
  const databaseAlreadyExists = await pathExists(options.databasePath);
  let applied: AppliedMigrationRow[] = [];

  if (databaseAlreadyExists) {
    const inspectionDatabase = new Database(options.databasePath, {
      fileMustExist: true,
      readonly: true,
    });

    try {
      assertNoPartialFoundation(inspectionDatabase);
      applied = readAppliedMigrations(inspectionDatabase);
      validateMigrationHistory(migrations, applied);
    } finally {
      inspectionDatabase.close();
    }
  }

  const pendingMigrations = migrations.slice(applied.length);

  if (pendingMigrations.length === 0) {
    return {
      appliedMigrationIds: [],
      backupPath: null,
      foreignKeysEnabled: true,
    };
  }

  await mkdir(path.dirname(options.databasePath), { recursive: true });

  const backupPath = databaseAlreadyExists
    ? createBackupName(
        options.databasePath,
        (options.now ?? (() => new Date()))(),
      )
    : null;

  if (backupPath !== null) {
    await copyFile(options.databasePath, backupPath);
  }

  const database = new Database(options.databasePath);
  let transactionStarted = false;

  try {
    database.pragma('foreign_keys = ON');
    database.exec('BEGIN IMMEDIATE');
    transactionStarted = true;
    createMigrationTable(database);

    const insertMigration = database.prepare(
      `INSERT INTO "${MIGRATION_TABLE}" (id, checksum, applied_at, technical_version) VALUES (?, ?, ?, 1)`,
    );

    for (const migration of pendingMigrations) {
      database.exec(migration.sql);
      insertMigration.run(
        migration.id,
        migration.checksum,
        (options.now ?? (() => new Date()))().toISOString(),
      );
    }

    validateDatabaseIntegrity(database);
    database.exec('COMMIT');
    transactionStarted = false;

    return {
      appliedMigrationIds: pendingMigrations.map((migration) => migration.id),
      backupPath,
      foreignKeysEnabled: true,
    };
  } catch (error: unknown) {
    if (transactionStarted) {
      database.exec('ROLLBACK');
    }

    database.close();

    try {
      if (databaseAlreadyExists && backupPath !== null) {
        await copyFile(backupPath, options.databasePath);
      } else {
        await removeDatabaseArtifacts(options.databasePath);
      }
    } catch {
      throw new MigrationInfrastructureError(MIGRATION_ERROR_CODES.recovery);
    }

    throw error instanceof MigrationInfrastructureError
      ? error
      : new MigrationInfrastructureError(MIGRATION_ERROR_CODES.apply);
  } finally {
    if (database.open) {
      database.close();
    }
  }
}
