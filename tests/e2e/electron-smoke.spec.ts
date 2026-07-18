import { _electron as electron, expect, test } from '@playwright/test';

test('abre o shell com isolamento e IPC restrito', async () => {
  const electronEnvironment: Record<string, string> = {};

  for (const [name, value] of Object.entries(process.env)) {
    if (name !== 'ELECTRON_RUN_AS_NODE' && value !== undefined) {
      electronEnvironment[name] = value;
    }
  }

  const application = await electron.launch({
    args: ['.'],
    env: electronEnvironment,
  });

  try {
    const page = await application.firstWindow();

    await expect(page).toHaveTitle('RUMO');
    await expect(page.getByRole('heading', { name: 'RUMO' })).toBeVisible();

    const exposedSurface = await page.evaluate(() => ({
      diagnosticsCheck: typeof window.rumo?.diagnostics?.check,
      electron: typeof Reflect.get(window, 'electron'),
      ipcRenderer: typeof Reflect.get(window, 'ipcRenderer'),
      nodeProcess: typeof Reflect.get(window, 'process'),
      require: typeof Reflect.get(window, 'require'),
    }));

    expect(exposedSurface).toEqual({
      diagnosticsCheck: 'function',
      electron: 'undefined',
      ipcRenderer: 'undefined',
      nodeProcess: 'undefined',
      require: 'undefined',
    });

    await page.getByRole('button', { name: 'Verificar fundação' }).click();
    await expect(page.getByText('Fundação operacional.')).toBeVisible();
  } finally {
    await application.close();
  }
});
