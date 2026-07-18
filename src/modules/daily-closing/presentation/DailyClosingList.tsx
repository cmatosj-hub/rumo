import type { DailyClosingRecord } from '../../../shared/contracts';
import {
  formatCurrency,
  formatDistance,
  formatOperationalDate,
  formatWorkedTime,
} from './formatters';

interface DailyClosingListProps {
  readonly closings: readonly DailyClosingRecord[];
  readonly errorMessage: string | null;
  readonly isLoading: boolean;
  readonly onRetry: () => Promise<void>;
  readonly successMessage: string | null;
}

export function DailyClosingList({
  closings,
  errorMessage,
  isLoading,
  onRetry,
  successMessage,
}: DailyClosingListProps): React.JSX.Element {
  return (
    <section aria-labelledby="closings-title" className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Histórico</p>
          <h1 id="closings-title">Fechamentos</h1>
          <p>
            Acompanhe os registros diários do mais recente para o mais antigo.
          </p>
        </div>
      </header>

      {successMessage !== null && (
        <div className="feedback feedback--success" role="status">
          {successMessage}
        </div>
      )}

      {isLoading && (
        <div className="state-card" role="status">
          Carregando fechamentos…
        </div>
      )}

      {!isLoading && errorMessage !== null && (
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

      {!isLoading && errorMessage === null && closings.length === 0 && (
        <div className="state-card">
          <h2>Nenhum fechamento registrado</h2>
          <p>Use “Fechar dia” para registrar sua primeira operação.</p>
        </div>
      )}

      {!isLoading && errorMessage === null && closings.length > 0 && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Ganhos</th>
                <th>Gastos</th>
                <th>Resultado</th>
                <th>Horas</th>
                <th>Quilômetros</th>
              </tr>
            </thead>
            <tbody>
              {closings.map((closing) => (
                <tr key={closing.id}>
                  <td>
                    <strong>
                      {formatOperationalDate(closing.operationalDate)}
                    </strong>
                  </td>
                  <td>{formatCurrency(closing.summary.totalEarningsCents)}</td>
                  <td>{formatCurrency(closing.summary.totalExpensesCents)}</td>
                  <td
                    className={
                      closing.summary.netResultCents < 0
                        ? 'negative-value'
                        : 'positive-value'
                    }
                  >
                    {formatCurrency(closing.summary.netResultCents)}
                  </td>
                  <td>{formatWorkedTime(closing.workedSeconds)}</td>
                  <td>{formatDistance(closing.summary.distanceMeters)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
