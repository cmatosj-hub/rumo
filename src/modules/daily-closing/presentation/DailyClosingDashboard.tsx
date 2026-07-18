import type { DailyClosingRecord } from '../../../shared/contracts';
import { formatCurrency, formatOperationalDate } from './formatters';

interface DailyClosingDashboardProps {
  readonly closings: readonly DailyClosingRecord[];
  readonly errorMessage: string | null;
  readonly isLoading: boolean;
  readonly onCreateClosing: () => void;
  readonly onRetry: () => Promise<void>;
}

export function DailyClosingDashboard({
  closings,
  errorMessage,
  isLoading,
  onCreateClosing,
  onRetry,
}: DailyClosingDashboardProps): React.JSX.Element {
  const latestClosing = closings[0];

  return (
    <section aria-labelledby="dashboard-title" className="page-stack">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1 id="dashboard-title">Seu dia no rumo certo.</h1>
          <p>
            Registre a operação diária e acompanhe o resultado salvo localmente.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={onCreateClosing}
          type="button"
        >
          Fechar dia
        </button>
      </header>

      {isLoading && (
        <div className="state-card" role="status">
          Carregando seu resumo…
        </div>
      )}
      {!isLoading && errorMessage !== null && (
        <div className="state-card state-card--error" role="alert">
          <h2>Resumo indisponível</h2>
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
      {!isLoading && errorMessage === null && latestClosing === undefined && (
        <div className="dashboard-empty">
          <p className="eyebrow">Primeiro passo</p>
          <h2>Registre seu primeiro fechamento</h2>
          <p>Seus ganhos, gastos, quilômetros e horas aparecerão aqui.</p>
          <button
            className="secondary-button"
            onClick={onCreateClosing}
            type="button"
          >
            Começar agora
          </button>
        </div>
      )}
      {!isLoading && errorMessage === null && latestClosing !== undefined && (
        <div className="metric-grid">
          <article className="metric-card">
            <span>Fechamentos registrados</span>
            <strong>{closings.length}</strong>
            <small>salvos neste dispositivo</small>
          </article>
          <article className="metric-card metric-card--accent">
            <span>Resultado mais recente</span>
            <strong>
              {formatCurrency(latestClosing.summary.netResultCents)}
            </strong>
            <small>
              {formatOperationalDate(latestClosing.operationalDate)}
            </small>
          </article>
        </div>
      )}
    </section>
  );
}
