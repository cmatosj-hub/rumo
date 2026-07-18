import { useMemo, useState } from 'react';
import type { DailyClosingRecord } from '../../../shared/contracts';
import {
  currentLocalDate,
  formatCurrency,
  formatDistance,
  formatOperationalDate,
  formatWorkedTime,
} from './formatters';
import {
  filterDailyClosings,
  type ClosingPeriodFilter,
} from '../../dashboard/domain/operational-dashboard';

interface Props {
  readonly closings: readonly DailyClosingRecord[];
  readonly errorMessage: string | null;
  readonly isLoading: boolean;
  readonly onRetry: () => Promise<void>;
  readonly successMessage: string | null;
  readonly weekStartsOn: number;
}
const filters: readonly { label: string; value: ClosingPeriodFilter }[] = [
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mês', value: 'month' },
  { label: 'Todos', value: 'all' },
];

export function DailyClosingList({
  closings,
  errorMessage,
  isLoading,
  onRetry,
  successMessage,
  weekStartsOn,
}: Props): React.JSX.Element {
  const [period, setPeriod] = useState<ClosingPeriodFilter>('week');
  const [searchDate, setSearchDate] = useState('');
  const filtered = useMemo(
    () =>
      filterDailyClosings({
        closings,
        period,
        searchDate,
        today: currentLocalDate(),
        weekStartsOn,
      }),
    [closings, period, searchDate, weekStartsOn],
  );
  return (
    <section aria-labelledby="closings-title" className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Histórico operacional</p>
          <h1 id="closings-title">Fechamentos</h1>
          <p>
            Consulte sua rotina diária do registro mais recente ao mais antigo.
          </p>
        </div>
      </header>
      {successMessage && (
        <div className="feedback feedback--success" role="status">
          {successMessage}
        </div>
      )}
      <div className="toolbar">
        <div
          aria-label="Filtrar período"
          className="segmented-control"
          role="group"
        >
          {filters.map((filter) => (
            <button
              aria-pressed={period === filter.value}
              key={filter.value}
              onClick={() => setPeriod(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className="date-search">
          <span>Buscar por data</span>
          <input
            aria-label="Buscar por data"
            onChange={(event) => setSearchDate(event.target.value)}
            type="date"
            value={searchDate}
          />
        </label>
      </div>
      {isLoading && (
        <div className="state-card" role="status">
          Carregando fechamentos…
        </div>
      )}
      {!isLoading && errorMessage && (
        <div className="state-card state-card--error" role="alert">
          <h2>Não foi possível carregar</h2>
          <p>{errorMessage}</p>
          <button
            className="secondary-button"
            onClick={() => void onRetry()}
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      )}
      {!isLoading && !errorMessage && closings.length === 0 && (
        <div className="empty-panel">
          <h2>Nenhum fechamento registrado</h2>
          <p>Use “Fechar dia” para registrar sua primeira operação.</p>
        </div>
      )}
      {!isLoading &&
        !errorMessage &&
        closings.length > 0 &&
        filtered.length === 0 && (
          <div className="state-card">
            <h2>Nenhum resultado encontrado</h2>
            <p>Ajuste o período ou a data pesquisada.</p>
          </div>
        )}
      {!isLoading && !errorMessage && filtered.length > 0 && (
        <div className="closing-cards">
          {filtered.map((closing) => (
            <article className="closing-card" key={closing.id}>
              <div className="closing-card__date">
                <span>{formatOperationalDate(closing.operationalDate)}</span>
                <small>
                  {formatWorkedTime(closing.workedSeconds)} trabalhadas
                </small>
              </div>
              <dl>
                <div>
                  <dt>Ganhos</dt>
                  <dd>{formatCurrency(closing.summary.totalEarningsCents)}</dd>
                </div>
                <div>
                  <dt>Gastos</dt>
                  <dd>{formatCurrency(closing.summary.totalExpensesCents)}</dd>
                </div>
                <div>
                  <dt>Distância</dt>
                  <dd>{formatDistance(closing.summary.distanceMeters)}</dd>
                </div>
              </dl>
              <div className="closing-card__result">
                <span>Resultado líquido</span>
                <strong
                  className={
                    closing.summary.netResultCents < 0
                      ? 'negative-value'
                      : 'positive-value'
                  }
                >
                  {formatCurrency(closing.summary.netResultCents)}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
