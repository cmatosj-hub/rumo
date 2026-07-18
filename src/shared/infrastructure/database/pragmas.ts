import type { PrismaClient } from '../../../generated/prisma/client';

export async function applyDatabasePragmas(
  client: PrismaClient,
): Promise<void> {
  await client.$executeRawUnsafe('PRAGMA foreign_keys = ON');
}

export async function areForeignKeysEnabled(
  client: PrismaClient,
): Promise<boolean> {
  const rows = await client.$queryRawUnsafe<{ foreign_keys: bigint }[]>(
    'PRAGMA foreign_keys',
  );

  return rows[0]?.foreign_keys === 1n;
}
