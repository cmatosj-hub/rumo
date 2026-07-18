export const MIGRATION_ERROR_CODES = {
  apply: 'MIGRATION_APPLY_FAILED',
  checksum: 'MIGRATION_CHECKSUM_MISMATCH',
  discovery: 'MIGRATION_DISCOVERY_FAILED',
  history: 'MIGRATION_HISTORY_INVALID',
  integrity: 'MIGRATION_INTEGRITY_FAILED',
  recovery: 'MIGRATION_RECOVERY_FAILED',
} as const;

export type MigrationErrorCode =
  (typeof MIGRATION_ERROR_CODES)[keyof typeof MIGRATION_ERROR_CODES];

export class MigrationInfrastructureError extends Error {
  readonly code: MigrationErrorCode;

  constructor(code: MigrationErrorCode) {
    super('Não foi possível atualizar a estrutura do armazenamento local.');
    this.code = code;
    this.name = 'MigrationInfrastructureError';
  }
}
