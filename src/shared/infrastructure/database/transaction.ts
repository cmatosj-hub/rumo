import type { Prisma, PrismaClient } from '../../../generated/prisma/client';

export type DatabaseTransactionOperation<T> = (
  transaction: Prisma.TransactionClient,
) => Promise<T>;

export async function executeDatabaseTransaction<T>(
  client: PrismaClient,
  operation: DatabaseTransactionOperation<T>,
): Promise<T> {
  return client.$transaction(operation);
}
