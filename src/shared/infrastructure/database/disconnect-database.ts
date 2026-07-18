import type { PrismaClient } from '../../../generated/prisma/client';

export async function disconnectDatabase(
  client: PrismaClient | null,
): Promise<void> {
  await client?.$disconnect();
}
