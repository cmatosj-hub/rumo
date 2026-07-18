import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const MIGRATIONS_DIRECTORY = path.resolve('prisma/migrations');
const FOUNDATION_MIGRATION = '20260717220000_foundation';
const DAILY_CLOSING_MIGRATION = '20260718010000_daily_closings';

describe('migration fundacional', () => {
  it('mantém as migrations versionadas em ordem determinística', async () => {
    const entries = await readdir(MIGRATIONS_DIRECTORY, {
      withFileTypes: true,
    });
    const migrationDirectories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(migrationDirectories).toEqual([
      FOUNDATION_MIGRATION,
      DAILY_CLOSING_MIGRATION,
    ]);
    await expect(
      readFile(
        path.join(MIGRATIONS_DIRECTORY, FOUNDATION_MIGRATION, 'migration.sql'),
        'utf8',
      ),
    ).resolves.not.toHaveLength(0);
  });

  it('adiciona o fechamento diário sem alterar a migration fundacional', async () => {
    const sql = await readFile(
      path.join(MIGRATIONS_DIRECTORY, DAILY_CLOSING_MIGRATION, 'migration.sql'),
      'utf8',
    );

    expect(sql).toContain('CREATE TABLE "daily_closings"');
    expect(sql).toContain('daily_closings_user_date_key');
    expect(sql).toContain('final_odometer_meters');
    expect(sql).toContain('worked_seconds');
  });

  it('cria somente metadados, usuário local, preferências e auditoria', async () => {
    const sql = await readFile(
      path.join(MIGRATIONS_DIRECTORY, FOUNDATION_MIGRATION, 'migration.sql'),
      'utf8',
    );
    const createdTables = Array.from(
      sql.matchAll(/CREATE TABLE "([^"]+)"/g),
      (match) => match[1],
    );

    expect(createdTables).toEqual([
      'local_users',
      'user_settings',
      'audit_log',
    ]);
    expect(sql).toContain('audit_log_reject_update');
    expect(sql).toContain('audit_log_reject_delete');
    expect(sql).not.toMatch(
      /CREATE TABLE "(?:accounts|vehicles|trips|expenses|revenues|goals|budgets|maintenance|documents)"/,
    );
  });
});
