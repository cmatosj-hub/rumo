// @vitest-environment node

import { execFile } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

const executeFile = promisify(execFile);
const packageRoot = path.resolve('out/rumo-win32-x64');
const resourcesDirectory = path.join(packageRoot, 'resources');

describe('layout do pacote Windows', () => {
  it('contém executável, migration e módulo SQLite desempacotado', async () => {
    const expectedFiles = [
      path.join(packageRoot, 'RUMO.exe'),
      path.join(
        resourcesDirectory,
        'migrations',
        '20260717220000_foundation',
        'migration.sql',
      ),
      path.join(
        resourcesDirectory,
        'migrations',
        '20260718010000_daily_closings',
        'migration.sql',
      ),
      path.join(
        resourcesDirectory,
        'app.asar.unpacked',
        'node_modules',
        'better-sqlite3',
        'build',
        'Release',
        'better_sqlite3.node',
      ),
    ];

    await Promise.all(
      expectedFiles.map(async (file) =>
        expect(access(file)).resolves.toBeUndefined(),
      ),
    );
  });

  it('inclui o Prisma Client e query compiler sem empacotar o Prisma CLI', async () => {
    const asarCli = path.resolve('node_modules/@electron/asar/bin/asar.js');
    const asarPath = path.join(resourcesDirectory, 'app.asar');
    const { stdout } = await executeFile(process.execPath, [
      asarCli,
      'list',
      asarPath,
    ]);

    expect(stdout).toMatch(/\.vite\\build\\create-database-client-/);
    expect(stdout).toMatch(/\.vite\\build\\query_compiler_fast_bg\.sqlite-/);
    expect(stdout).not.toContain('node_modules\\prisma\\build');

    const migrationSql = await readFile(
      path.join(
        resourcesDirectory,
        'migrations',
        '20260717220000_foundation',
        'migration.sql',
      ),
      'utf8',
    );
    expect(migrationSql).toContain('CREATE TABLE "local_users"');
  });
});
