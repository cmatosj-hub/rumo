import type { DailyClosingRecord } from '../../../shared/contracts/daily-closing-ipc';
import type { DailyClosingRepository } from './daily-closing-repository';

export async function listDailyClosings(
  repository: DailyClosingRepository,
): Promise<DailyClosingRecord[]> {
  return repository.list();
}
