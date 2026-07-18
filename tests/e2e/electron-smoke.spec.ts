import { _electron as electron, expect, test } from '@playwright/test';
import { access, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('abre o shell com isolamento e IPC restrito', async () => {
  const electronEnvironment: Record<string, string> = {};
  const temporaryUserData = await mkdtemp(
    path.join(os.tmpdir(), 'rumo-packaged-database-'),
  );
  const databasePath = path.join(temporaryUserData, 'data', 'rumo.db');
  const packagedMigrationPath = path.resolve(
    'out/rumo-win32-x64/resources/migrations/20260717220000_foundation/migration.sql',
  );

  for (const [name, value] of Object.entries(process.env)) {
    if (name !== 'ELECTRON_RUN_AS_NODE' && value !== undefined) {
      electronEnvironment[name] = value;
    }
  }

  electronEnvironment.RUMO_E2E_USER_DATA_PATH = temporaryUserData;

  await expect(access(packagedMigrationPath)).resolves.toBeUndefined();

  const application = await electron.launch({
    env: electronEnvironment,
    executablePath: path.resolve('out/rumo-win32-x64/RUMO.exe'),
  });
  const applicationProcess = application.process();
  const processErrors: string[] = [];

  applicationProcess.stderr?.on('data', (chunk: Buffer) => {
    processErrors.push(chunk.toString('utf8'));
  });

  try {
    const page = await Promise.race([
      application.firstWindow(),
      new Promise<never>((_resolve, reject) => {
        applicationProcess.once('exit', (code) => {
          reject(
            new Error(
              `O aplicativo encerrou antes de abrir a janela (código ${String(code)}): ${processErrors.join('').trim()}`,
            ),
          );
        });
      }),
    ]);

    await expect(page).toHaveTitle('RUMO');
    await expect(page.getByRole('heading', { name: 'RUMO' })).toBeVisible();

    const exposedSurface = await page.evaluate(() => ({
      diagnosticsCheck: typeof window.rumo?.diagnostics?.check,
      database: typeof Reflect.get(window.rumo, 'database'),
      electron: typeof Reflect.get(window, 'electron'),
      ipcRenderer: typeof Reflect.get(window, 'ipcRenderer'),
      nodeProcess: typeof Reflect.get(window, 'process'),
      require: typeof Reflect.get(window, 'require'),
    }));

    expect(exposedSurface).toEqual({
      diagnosticsCheck: 'function',
      database: 'undefined',
      electron: 'undefined',
      ipcRenderer: 'undefined',
      nodeProcess: 'undefined',
      require: 'undefined',
    });

    await page.getByRole('button', { name: 'Verificar fundação' }).click();
    await expect(page.getByText('Fundação operacional.')).toBeVisible();
    await expect
      .poll(async () => {
        try {
          await access(databasePath);
          return true;
        } catch {
          return false;
        }
      })
      .toBe(true);
  } finally {
    if (applicationProcess.exitCode === null) {
      await application.close();
    }
    await rm(temporaryUserData, {
      force: true,
      maxRetries: 5,
      recursive: true,
      retryDelay: 200,
    });
    await expect(access(temporaryUserData)).rejects.toThrow();
  }
});
