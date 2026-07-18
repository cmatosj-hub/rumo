import type { Clock } from '../../../shared/domain/clock';
import type { IdentifierGenerator } from '../../../shared/domain/identifier-generator';
import type {
  DailyClosingInput,
  DailyClosingRecord,
} from '../../../shared/contracts/daily-closing-ipc';
import { assertDailyClosingValues } from '../domain/daily-closing';
import type { DailyClosingRepository } from './daily-closing-repository';

export interface CreateDailyClosingDependencies {
  readonly clock: Clock;
  readonly identifierGenerator: IdentifierGenerator;
  readonly repository: DailyClosingRepository;
}

export async function createDailyClosing(
  dependencies: CreateDailyClosingDependencies,
  closing: DailyClosingInput,
  correlationId: string,
): Promise<DailyClosingRecord> {
  assertDailyClosingValues(closing);

  return dependencies.repository.create({
    auditId: dependencies.identifierGenerator.generate(),
    closing,
    closingId: dependencies.identifierGenerator.generate(),
    correlationId,
    localUserId: dependencies.identifierGenerator.generate(),
    settingsId: dependencies.identifierGenerator.generate(),
    timestamp: dependencies.clock.now(),
  });
}
