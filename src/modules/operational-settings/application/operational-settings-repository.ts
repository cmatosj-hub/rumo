import type {
  OperationalSettings,
  OperationalSettingsInput,
} from '../../../shared/contracts';

export interface UpdateOperationalSettingsPersistenceInput {
  readonly auditId: string;
  readonly correlationId: string;
  readonly localUserId: string;
  readonly settings: OperationalSettingsInput;
  readonly settingsId: string;
  readonly timestamp: Date;
}

export interface OperationalSettingsRepository {
  get(): Promise<OperationalSettings>;
  update(
    input: UpdateOperationalSettingsPersistenceInput,
  ): Promise<OperationalSettings>;
}
