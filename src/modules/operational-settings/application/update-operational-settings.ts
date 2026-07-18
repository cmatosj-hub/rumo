import type {
  OperationalSettings,
  OperationalSettingsInput,
} from '../../../shared/contracts';
import type { Clock } from '../../../shared/domain/clock';
import type { IdentifierGenerator } from '../../../shared/domain/identifier-generator';
import type { OperationalSettingsRepository } from './operational-settings-repository';

interface Dependencies {
  readonly clock: Clock;
  readonly identifierGenerator: IdentifierGenerator;
  readonly repository: OperationalSettingsRepository;
}

export function updateOperationalSettings(
  dependencies: Dependencies,
  settings: OperationalSettingsInput,
  correlationId: string,
): Promise<OperationalSettings> {
  return dependencies.repository.update({
    auditId: dependencies.identifierGenerator.generate(),
    correlationId,
    localUserId: dependencies.identifierGenerator.generate(),
    settings,
    settingsId: dependencies.identifierGenerator.generate(),
    timestamp: dependencies.clock.now(),
  });
}
