import type { PrismaClient } from '../../../generated/prisma/client';
import type { OperationalSettings } from '../../../shared/contracts';
import type {
  OperationalSettingsRepository,
  UpdateOperationalSettingsPersistenceInput,
} from '../application/operational-settings-repository';

const defaults: OperationalSettings = {
  minimumHourlyRateCents: null,
  monthlyGoalCents: null,
  updatedAtUtc: null,
  weeklyGoalCents: null,
  weekStartsOn: 1,
};

function toSettings(row: {
  minimumHourlyRateCents: number | null;
  monthlyGoalCents: number | null;
  updatedAt: Date;
  weeklyGoalCents: number | null;
  weekStartsOn: number;
}): OperationalSettings {
  return {
    minimumHourlyRateCents: row.minimumHourlyRateCents,
    monthlyGoalCents: row.monthlyGoalCents,
    updatedAtUtc: row.updatedAt.toISOString(),
    weeklyGoalCents: row.weeklyGoalCents,
    weekStartsOn: row.weekStartsOn,
  };
}

export class PrismaOperationalSettingsRepository implements OperationalSettingsRepository {
  constructor(private readonly client: PrismaClient) {}

  async get(): Promise<OperationalSettings> {
    const user = await this.client.localUser.findFirst({
      include: { settings: true },
      orderBy: { createdAt: 'asc' },
      where: { isActive: true },
    });
    return user?.settings === null || user === null
      ? defaults
      : toSettings(user.settings);
  }

  async update(
    input: UpdateOperationalSettingsPersistenceInput,
  ): Promise<OperationalSettings> {
    const row = await this.client.$transaction(async (transaction) => {
      let user = await transaction.localUser.findFirst({
        include: { settings: true },
        orderBy: { createdAt: 'asc' },
        where: { isActive: true },
      });
      if (user === null) {
        user = await transaction.localUser.create({
          data: {
            createdAt: input.timestamp,
            id: input.localUserId,
            isActive: true,
            name: 'Perfil local',
            settings: {
              create: {
                ...input.settings,
                createdAt: input.timestamp,
                id: input.settingsId,
                updatedAt: input.timestamp,
              },
            },
            updatedAt: input.timestamp,
          },
          include: { settings: true },
        });
      } else if (user.settings === null) {
        const settings = await transaction.userSettings.create({
          data: {
            ...input.settings,
            createdAt: input.timestamp,
            id: input.settingsId,
            updatedAt: input.timestamp,
            userId: user.id,
          },
        });
        user = { ...user, settings };
      } else {
        const settings = await transaction.userSettings.update({
          data: { ...input.settings, updatedAt: input.timestamp },
          where: { id: user.settings.id },
        });
        user = { ...user, settings };
      }

      const persistedSettings = user.settings;
      if (persistedSettings === null) {
        throw new Error('Operational settings were not persisted.');
      }

      await transaction.auditLog.create({
        data: {
          action: 'UPDATE',
          actorId: user.id,
          actorType: 'LOCAL_USER',
          correlationId: input.correlationId,
          entity: 'UserSettings',
          entityId: persistedSettings.id,
          id: input.auditId,
          nextValuesJson: JSON.stringify({ ...input.settings, version: 1 }),
          occurredAt: input.timestamp,
          source: 'USER_INTERFACE',
          userId: user.id,
        },
      });
      return persistedSettings;
    });
    return toSettings(row);
  }
}
