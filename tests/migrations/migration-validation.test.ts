import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const MIGRATIONS_DIRECTORY = path.resolve('prisma/migrations');
const FOUNDATION_MIGRATION = '20260717220000_foundation';

describe('migration fundacional', () => {
  it('mantém exatamente uma migration versionada e determinística', async () => {
    const entries = await readdir(MIGRATIONS_DIRECTORY, {
      withFileTypes: true,
    });
    const migrationDirectories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(migrationDirectories).toEqual([FOUNDATION_MIGRATION]);
    await expect(
      readFile(
        path.join(MIGRATIONS_DIRECTORY, FOUNDATION_MIGRATION, 'migration.sql'),
        'utf8',
      ),
    ).resolves.not.toHaveLength(0);
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
