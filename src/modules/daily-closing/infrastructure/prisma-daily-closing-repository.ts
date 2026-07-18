import type { Prisma, PrismaClient } from '../../../generated/prisma/client';
import type {
  DailyClosingInput,
  DailyClosingRecord,
} from '../../../shared/contracts/daily-closing-ipc';
import {
  DailyClosingDateConflictError,
  DailyClosingPersistenceError,
} from '../application/daily-closing-errors';
import type {
  CreateDailyClosingPersistenceInput,
  DailyClosingRepository,
} from '../application/daily-closing-repository';
import { calculateDailyClosingSummary } from '../domain/daily-closing';

type DailyClosingRow = Awaited<
  ReturnType<Prisma.TransactionClient['dailyClosing']['create']>
>;

function toRecord(row: DailyClosingRow): DailyClosingRecord {
  const closing: DailyClosingInput = {
    finalOdometerMeters: row.finalOdometerMeters,
    foodExpenseCents: row.foodExpenseCents,
    fuelExpenseCents: row.fuelExpenseCents,
    initialOdometerMeters: row.initialOdometerMeters,
    maintenanceExpenseCents: row.maintenanceExpenseCents,
    ninetyNineEarningsCents: row.ninetyNineEarningsCents,
    notes: row.notes,
    operationalDate: row.operationalDate,
    otherExpensesCents: row.otherExpensesCents,
    parkingExpenseCents: row.parkingExpenseCents,
    tollExpenseCents: row.tollExpenseCents,
    uberEarningsCents: row.uberEarningsCents,
    workedSeconds: row.workedSeconds,
  };

  return {
    ...closing,
    createdAtUtc: row.createdAt.toISOString(),
    id: row.id,
    summary: calculateDailyClosingSummary(closing),
    updatedAtUtc: row.updatedAt.toISOString(),
  };
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

export class PrismaDailyClosingRepository implements DailyClosingRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(
    input: CreateDailyClosingPersistenceInput,
  ): Promise<DailyClosingRecord> {
    try {
      const row = await this.client.$transaction(async (transaction) => {
        let localUser = await transaction.localUser.findFirst({
          orderBy: { createdAt: 'asc' },
          where: { isActive: true },
        });

        if (localUser === null) {
          localUser = await transaction.localUser.create({
            data: {
              createdAt: input.timestamp,
              id: input.localUserId,
              isActive: true,
              name: 'Perfil local',
              settings: {
                create: {
                  createdAt: input.timestamp,
                  id: input.settingsId,
                  updatedAt: input.timestamp,
                },
              },
              updatedAt: input.timestamp,
            },
          });
        }

        const closing = await transaction.dailyClosing.create({
          data: {
            ...input.closing,
            createdAt: input.timestamp,
            id: input.closingId,
            updatedAt: input.timestamp,
            userId: localUser.id,
          },
        });

        await transaction.auditLog.create({
          data: {
            action: 'CREATE',
            actorId: localUser.id,
            actorType: 'LOCAL_USER',
            correlationId: input.correlationId,
            entity: 'DailyClosing',
            entityId: closing.id,
            id: input.auditId,
            nextValuesJson: JSON.stringify({
              ...input.closing,
              version: 1,
            }),
            occurredAt: input.timestamp,
            operationalDate: input.closing.operationalDate,
            source: 'USER_INTERFACE',
            userId: localUser.id,
          },
        });

        return closing;
      });

      return toRecord(row);
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new DailyClosingDateConflictError();
      }

      throw new DailyClosingPersistenceError();
    }
  }

  async list(): Promise<DailyClosingRecord[]> {
    try {
      const localUser = await this.client.localUser.findFirst({
        orderBy: { createdAt: 'asc' },
        where: { isActive: true },
      });

      if (localUser === null) {
        return [];
      }

      const rows = await this.client.dailyClosing.findMany({
        orderBy: [{ operationalDate: 'desc' }, { createdAt: 'desc' }],
        where: { userId: localUser.id },
      });

      return rows.map(toRecord);
    } catch {
      throw new DailyClosingPersistenceError();
    }
  }
}
