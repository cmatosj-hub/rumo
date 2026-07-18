import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '../../src/renderer/app/App';
import type { DailyClosingRecord, RumoApi } from '../../src/shared/contracts';

const savedClosing: DailyClosingRecord = {
  createdAtUtc: '2026-07-18T12:00:00.000Z',
  finalOdometerMeters: 120_000,
  foodExpenseCents: 1_000,
  fuelExpenseCents: 2_000,
  id: '018f7c00-0000-7000-8000-000000000301',
  initialOdometerMeters: 100_000,
  maintenanceExpenseCents: 0,
  ninetyNineEarningsCents: 5_000,
  notes: null,
  operationalDate: '2026-07-18',
  otherExpensesCents: 0,
  parkingExpenseCents: 0,
  summary: {
    distanceMeters: 20_000,
    grossPerHourCents: 3_000,
    netPerHourCents: 2_400,
    netResultCents: 12_000,
    totalEarningsCents: 15_000,
    totalExpensesCents: 3_000,
  },
  tollExpenseCents: 0,
  uberEarningsCents: 10_000,
  updatedAtUtc: '2026-07-18T12:00:00.000Z',
  workedSeconds: 18_000,
};

function installRumoApi(options?: {
  readonly createResult?: Awaited<
    ReturnType<RumoApi['dailyClosings']['create']>
  >;
  readonly records?: DailyClosingRecord[];
}): RumoApi {
  const api: RumoApi = {
    dailyClosings: {
      create: vi
        .fn()
        .mockResolvedValue(
          options?.createResult ?? { data: savedClosing, ok: true },
        ),
      list: vi.fn().mockResolvedValue({
        data: options?.records ?? [],
        ok: true,
      }),
    },
    diagnostics: {
      check: vi.fn(),
    },
  };

  Object.defineProperty(window, 'rumo', {
    configurable: true,
    value: api,
  });
  return api;
}

function navigationButton(name: 'Fechar dia' | 'Fechamentos') {
  return within(
    screen.getByRole('navigation', { name: 'Navegação principal' }),
  ).getByRole('button', { name });
}

describe('primeira vertical do aplicativo', () => {
  beforeEach(() => {
    installRumoApi();
  });

  it('renderiza o shell, navegação e dashboard vazio', async () => {
    render(<App />);

    expect(screen.getByText('RUMO')).toBeVisible();
    expect(
      screen.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeVisible();
    expect(
      await screen.findByText('Registre seu primeiro fechamento'),
    ).toBeVisible();
    expect(navigationButton('Fechar dia')).toBeVisible();
    expect(navigationButton('Fechamentos')).toBeVisible();
  });

  it('renderiza o formulário e calcula o resumo enquanto o usuário digita', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navigationButton('Fechar dia'));

    await user.clear(screen.getByLabelText(/Ganhos Uber/));
    await user.type(screen.getByLabelText(/Ganhos Uber/), '100,00');
    await user.clear(screen.getByLabelText(/Ganhos 99/));
    await user.type(screen.getByLabelText(/Ganhos 99/), '50,00');
    await user.clear(screen.getByLabelText(/Combustível/));
    await user.type(screen.getByLabelText(/Combustível/), '30,00');
    await user.clear(screen.getByLabelText('Horas líquidas trabalhadas'));
    await user.type(screen.getByLabelText('Horas líquidas trabalhadas'), '5');

    const summary = screen.getByRole('complementary', {
      name: 'Resumo do fechamento',
    });
    expect(within(summary).getByText(/150,00/)).toBeVisible();
    expect(within(summary).getByText(/120,00/)).toBeVisible();
    expect(within(summary).getAllByText(/30,00/)).toHaveLength(2);
    expect(within(summary).getByText(/24,00/)).toBeVisible();
  });

  it('mostra validação obrigatória próxima ao campo de data', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navigationButton('Fechar dia'));
    await user.clear(screen.getByLabelText('Data do fechamento'));
    await user.click(screen.getByRole('button', { name: 'Salvar fechamento' }));

    expect(screen.getByText('Informe a data do fechamento.')).toBeVisible();
  });

  it('salva, protege o envio e redireciona para a listagem com sucesso', async () => {
    const api = installRumoApi();
    const user = userEvent.setup();
    render(<App />);
    await user.click(navigationButton('Fechar dia'));
    await user.click(screen.getByRole('button', { name: 'Salvar fechamento' }));

    expect(
      await screen.findByText('Fechamento salvo com sucesso.'),
    ).toBeVisible();
    expect(api.dailyClosings.create).toHaveBeenCalledTimes(1);
  });

  it('mantém os dados e apresenta o erro devolvido pelo processo principal', async () => {
    installRumoApi({
      createResult: {
        error: {
          code: 'DAILY_CLOSING_DATE_CONFLICT',
          correlationId: '018f7c00-0000-7000-8000-000000000302',
          message: 'Já existe um fechamento para esta data.',
        },
        ok: false,
      },
    });
    const user = userEvent.setup();
    render(<App />);
    await user.click(navigationButton('Fechar dia'));
    await user.clear(screen.getByLabelText(/Ganhos Uber/));
    await user.type(screen.getByLabelText(/Ganhos Uber/), '321,45');
    await user.click(screen.getByRole('button', { name: 'Salvar fechamento' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe um fechamento para esta data.',
    );
    expect(screen.getByLabelText(/Ganhos Uber/)).toHaveValue('321,45');
  });

  it('mostra a listagem vazia e a listagem com registros', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(navigationButton('Fechamentos'));
    expect(
      await screen.findByText('Nenhum fechamento registrado'),
    ).toBeVisible();

    unmount();
    installRumoApi({ records: [savedClosing] });
    render(<App />);
    await user.click(navigationButton('Fechamentos'));
    expect(await screen.findByText('18/07/2026')).toBeVisible();
    expect(screen.getByText(/120,00/)).toBeVisible();
  });
});
