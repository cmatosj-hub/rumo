import { createHash } from 'node:crypto';

export function normalizeMigrationSql(sql: string): string {
  return sql.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
}

export function calculateMigrationChecksum(sql: string): string {
  return createHash('sha256')
    .update(normalizeMigrationSql(sql), 'utf8')
    .digest('hex');
}
