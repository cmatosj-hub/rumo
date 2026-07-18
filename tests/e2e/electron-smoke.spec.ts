import { _electron as electron, expect, test } from '@playwright/test';
import { access, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

function electronEnvironment(userDataPath: string): Record<string, string> {
  const environment: Record<string, string> = {};

  for (const [name, value] of Object.entries(process.env)) {
    if (name !== 'ELECTRON_RUN_AS_NODE' && value !== undefined) {
      environment[name] = value;
    }
  }

  environment.RUMO_E2E_USER_DATA_PATH = userDataPath;
  return environment;
}

test('registra um fechamento e o mantém após reabrir o aplicativo', async () => {
  const temporaryUserData = await mkdtemp(
    path.join(os.tmpdir(), 'rumo-packaged-database-'),
  );
  const databasePath = path.join(temporaryUserData, 'data', 'rumo.db');
  const packagedMigrationPath = path.resolve(
    'out/rumo-win32-x64/resources/migrations/20260718010000_daily_closings/migration.sql',
  );

  await expect(access(packagedMigrationPath)).resolves.toBeUndefined();

  const firstApplication = await electron.launch({
    env: electronEnvironment(temporaryUserData),
    executablePath: path.resolve('out/rumo-win32-x64/RUMO.exe'),
  });

  try {
    const page = await firstApplication.firstWindow();
    await expect(page).toHaveTitle('RUMO');
    await expect(page.getByText('RUMO', { exact: true })).toBeVisible();

    const exposedSurface = await page.evaluate(() => ({
      createClosing: typeof window.rumo?.dailyClosings?.create,
      listClosings: typeof window.rumo?.dailyClosings?.list,
      database: typeof Reflect.get(window.rumo, 'database'),
      electron: typeof Reflect.get(window, 'electron'),
      ipcRenderer: typeof Reflect.get(window, 'ipcRenderer'),
      nodeProcess: typeof Reflect.get(window, 'process'),
      require: typeof Reflect.get(window, 'require'),
    }));

    expect(exposedSurface).toEqual({
      createClosing: 'function',
      database: 'undefined',
      electron: 'undefined',
      ipcRenderer: 'undefined',
      listClosings: 'function',
      nodeProcess: 'undefined',
      require: 'undefined',
    });

    const navigation = page.getByRole('navigation', {
      name: 'Navegação principal',
    });
    await navigation.getByRole('button', { name: 'Fechar dia' }).click();
    await page.getByLabel('Data do fechamento').fill('2026-07-18');
    await page.getByLabel(/Ganhos Uber/).fill('250,50');
    await page.getByLabel(/Ganhos 99/).fill('100,25');
    await page.getByLabel(/Combustível/).fill('80,00');
    await page.getByLabel('Quilômetros iniciais').fill('1000');
    await page.getByLabel('Quilômetros finais').fill('1125,5');
    await page.getByLabel('Horas líquidas trabalhadas').fill('8,5');
    await page
      .getByLabel('Observações do dia (opcional)')
      .fill('Registro persistido pelo teste empacotado.');
    await page.getByRole('button', { name: 'Salvar fechamento' }).click();

    await expect(page.getByText('Fechamento salvo com sucesso.')).toBeVisible();
    await expect(page.getByText('18/07/2026')).toBeVisible();
    await expect(access(databasePath)).resolves.toBeUndefined();
  } finally {
    await firstApplication.close();
  }

  const reopenedApplication = await electron.launch({
    env: electronEnvironment(temporaryUserData),
    executablePath: path.resolve('out/rumo-win32-x64/RUMO.exe'),
  });

  try {
    const reopenedPage = await reopenedApplication.firstWindow();
    await reopenedPage
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('button', { name: 'Fechamentos' })
      .click();
    await expect(reopenedPage.getByText('18/07/2026')).toBeVisible();
    await expect(reopenedPage.getByText(/350,75/)).toBeVisible();
  } finally {
    await reopenedApplication.close();
    await rm(temporaryUserData, {
      force: true,
      maxRetries: 5,
      recursive: true,
      retryDelay: 200,
    });
    await expect(access(temporaryUserData)).rejects.toThrow();
  }
});
