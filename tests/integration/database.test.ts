// @vitest-environment node

import { access, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { PrismaClient } from '../../src/generated/prisma/client';
import { createDatabaseClient } from '../../src/shared/infrastructure/database/create-database-client';
import { resolveDatabasePath } from '../../src/shared/infrastructure/database/database-path';
import { disconnectDatabase } from '../../src/shared/infrastructure/database/disconnect-database';
import { areForeignKeysEnabled } from '../../src/shared/infrastructure/database/pragmas';
import { executeDatabaseTransaction } from '../../src/shared/infrastructure/database/transaction';

const temporaryDirectories: string[] = [];

async function createTemporaryDatabasePath(): Promise<{
  databasePath: string;
  userDataPath: string;
}> {
  const userDataPath = await mkdtemp(path.join(os.tmpdir(), 'rumo-database-'));
  temporaryDirectories.push(userDataPath);

  return {
    databasePath: resolveDatabasePath(userDataPath),
    userDataPath,
  };
}

async function expectPathNotToExist(targetPath: string): Promise<void> {
  await expect(access(targetPath)).rejects.toThrow();
}

async function createTechnicalTable(client: PrismaClient): Promise<void> {
  await client.$executeRawUnsafe(
    'CREATE TABLE technical_spike (id TEXT PRIMARY KEY, value TEXT NOT NULL)',
  );
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(async (directory) => {
      await rm(directory, { force: true, recursive: true });
    }),
  );
});

describe('infraestrutura Prisma e SQLite', () => {
  it('não cria banco ao importar a infraestrutura', async () => {
    const { databasePath } = await createTemporaryDatabasePath();

    await import('../../src/shared/infrastructure/database/create-database-client');

    await expectPathNotToExist(databasePath);
  });

  it('abre somente por chamada explícita e fecha um banco temporário', async () => {
    const { databasePath } = await createTemporaryDatabasePath();
    await expectPathNotToExist(databasePath);

    const client = await createDatabaseClient(databasePath);
    await expect(access(databasePath)).resolves.toBeUndefined();

    await disconnectDatabase(client);
  });

  it('mantém foreign keys habilitadas e aplicadas', async () => {
    const { databasePath } = await createTemporaryDatabasePath();
    const client = await createDatabaseClient(databasePath);

    try {
      expect(await areForeignKeysEnabled(client)).toBe(true);
      await client.$executeRawUnsafe(
        'CREATE TABLE parent (id TEXT PRIMARY KEY)',
      );
      await client.$executeRawUnsafe(
        'CREATE TABLE child (id TEXT PRIMARY KEY, parent_id TEXT NOT NULL REFERENCES parent(id))',
      );

      await expect(
        client.$executeRawUnsafe(
          "INSERT INTO child (id, parent_id) VALUES ('child', 'missing')",
        ),
      ).rejects.toThrow();
    } finally {
      await disconnectDatabase(client);
    }
  });

  it('confirma todas as alterações de uma transação bem-sucedida', async () => {
    const { databasePath } = await createTemporaryDatabasePath();
    const client = await createDatabaseClient(databasePath);

    try {
      await createTechnicalTable(client);
      await executeDatabaseTransaction(client, async (transaction) => {
        await transaction.$executeRawUnsafe(
          "INSERT INTO technical_spike (id, value) VALUES ('1', 'primeiro')",
        );
        await transaction.$executeRawUnsafe(
          "INSERT INTO technical_spike (id, value) VALUES ('2', 'segundo')",
        );
      });

      const rows = await client.$queryRawUnsafe<{ id: string }[]>(
        'SELECT id FROM technical_spike ORDER BY id',
      );
      expect(rows).toEqual([{ id: '1' }, { id: '2' }]);
    } finally {
      await disconnectDatabase(client);
    }
  });

  it('desfaz todas as alterações quando a transação falha', async () => {
    const { databasePath } = await createTemporaryDatabasePath();
    const client = await createDatabaseClient(databasePath);

    try {
      await createTechnicalTable(client);

      await expect(
        executeDatabaseTransaction(client, async (transaction) => {
          await transaction.$executeRawUnsafe(
            "INSERT INTO technical_spike (id, value) VALUES ('1', 'temporário')",
          );
          throw new Error('falha controlada');
        }),
      ).rejects.toThrow('falha controlada');

      const rows = await client.$queryRawUnsafe<{ id: string }[]>(
        'SELECT id FROM technical_spike',
      );
      expect(rows).toEqual([]);
    } finally {
      await disconnectDatabase(client);
    }
  });
});
