import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v7 as uuidV7 } from 'uuid';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '../../src/renderer/app/App';
import type { RumoApi } from '../../src/shared/contracts';

function installRumoApi(api: RumoApi): void {
  Object.defineProperty(window, 'rumo', {
    configurable: true,
    value: api,
  });
}

describe('shell do aplicativo', () => {
  beforeEach(() => {
    installRumoApi({
      diagnostics: {
        check: vi.fn().mockResolvedValue({
          data: {
            applicationVersion: '0.1.0',
            correlationId: uuidV7(),
            electronVersion: '43.1.0',
            nodeVersion: '24.0.0',
            status: 'ready',
            timestampUtc: new Date().toISOString(),
          },
          ok: true,
        }),
      },
    });
  });

  it('exibe o estado inicial da fundação', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'RUMO' })).toBeVisible();
    expect(screen.getByText('Diagnóstico ainda não executado.')).toBeVisible();
  });

  it('consulta somente a API tipada exposta pelo preload', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Verificar fundação' }),
    );

    expect(await screen.findByText('Fundação operacional.')).toBeVisible();
  });
});
