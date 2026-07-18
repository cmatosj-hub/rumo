import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { calculateMigrationChecksum } from './migration-checksum';
import {
  MIGRATION_ERROR_CODES,
  MigrationInfrastructureError,
} from './migration-error';

const MIGRATION_DIRECTORY_PATTERN = /^\d{14}_[a-z0-9_]+$/;

export interface MigrationDefinition {
  readonly checksum: string;
  readonly id: string;
  readonly sql: string;
}

export async function discoverMigrations(
  migrationsDirectory: string,
): Promise<MigrationDefinition[]> {
  try {
    const entries = await readdir(migrationsDirectory, { withFileTypes: true });
    const migrationIds = entries
      .filter(
        (entry) =>
          entry.isDirectory() && MIGRATION_DIRECTORY_PATTERN.test(entry.name),
      )
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));

    return await Promise.all(
      migrationIds.map(async (id) => {
        const sql = await readFile(
          path.join(migrationsDirectory, id, 'migration.sql'),
          'utf8',
        );

        return {
          checksum: calculateMigrationChecksum(sql),
          id,
          sql,
        };
      }),
    );
  } catch (error: unknown) {
    throw new MigrationInfrastructureError(
      MIGRATION_ERROR_CODES.discovery,
      error,
    );
  }
}
