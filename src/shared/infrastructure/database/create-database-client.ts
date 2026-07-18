import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import { PrismaClient } from '../../../generated/prisma/client';
import { applyDatabasePragmas, areForeignKeysEnabled } from './pragmas';
import { toSqliteUrl } from './database-path';

export const DATABASE_ERROR_CODES = {
  connection: 'DATABASE_CONNECTION_FAILED',
  filesystem: 'DATABASE_FILESYSTEM_FAILED',
  pragmas: 'DATABASE_PRAGMAS_FAILED',
} as const;

export type DatabaseErrorCode =
  (typeof DATABASE_ERROR_CODES)[keyof typeof DATABASE_ERROR_CODES];

export class DatabaseInfrastructureError extends Error {
  readonly code: DatabaseErrorCode;

  constructor(code: DatabaseErrorCode) {
    super('Não foi possível inicializar o armazenamento local.');
    this.code = code;
    this.name = 'DatabaseInfrastructureError';
  }
}

export async function createDatabaseClient(
  databasePath: string,
): Promise<PrismaClient> {
  try {
    await mkdir(path.dirname(databasePath), { recursive: true });
  } catch {
    throw new DatabaseInfrastructureError(DATABASE_ERROR_CODES.filesystem);
  }

  let client: PrismaClient;

  try {
    const adapter = new PrismaBetterSqlite3({ url: toSqliteUrl(databasePath) });
    client = new PrismaClient({ adapter });
  } catch {
    throw new DatabaseInfrastructureError(DATABASE_ERROR_CODES.connection);
  }

  try {
    await applyDatabasePragmas(client);

    if (!(await areForeignKeysEnabled(client))) {
      throw new DatabaseInfrastructureError(DATABASE_ERROR_CODES.pragmas);
    }

    return client;
  } catch (error: unknown) {
    await client.$disconnect();

    throw error instanceof DatabaseInfrastructureError
      ? error
      : new DatabaseInfrastructureError(DATABASE_ERROR_CODES.pragmas);
  }
}
