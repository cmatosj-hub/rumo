import type { OperationalSettings } from '../../../shared/contracts';
import type { OperationalSettingsRepository } from './operational-settings-repository';

export function getOperationalSettings(
  repository: OperationalSettingsRepository,
): Promise<OperationalSettings> {
  return repository.get();
}
