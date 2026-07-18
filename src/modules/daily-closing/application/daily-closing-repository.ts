import type {
  DailyClosingInput,
  DailyClosingRecord,
} from '../../../shared/contracts/daily-closing-ipc';

export interface CreateDailyClosingPersistenceInput {
  readonly auditId: string;
  readonly closing: DailyClosingInput;
  readonly closingId: string;
  readonly correlationId: string;
  readonly localUserId: string;
  readonly settingsId: string;
  readonly timestamp: Date;
}

export interface DailyClosingRepository {
  create(
    input: CreateDailyClosingPersistenceInput,
  ): Promise<DailyClosingRecord>;
  list(): Promise<DailyClosingRecord[]>;
}
