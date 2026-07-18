import type { DashboardSnapshot } from '../../dashboard/domain/operational-dashboard';
import { AppIcon } from '../../../renderer/components/AppIcon';
import {
  formatCurrency,
  formatDistance,
  formatOperationalDate,
  formatWorkedTime,
} from './formatters';

interface Props {
  readonly dashboard: DashboardSnapshot;
  readonly errorMessage: string | null;
  readonly isLoading: boolean;
  readonly onCreateClosing: () => void;
  readonly onOpenSettings: () => void;
  readonly onRetry: () => Promise<void>;
}

function Metric({
  label,
  value,
  detail,
}: {
  readonly label: string;
  readonly value: string;
  readonly detail?: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}

export function DailyClosingDashboard({
  dashboard,
  errorMessage,
  isLoading,
  onCreateClosing,
  onOpenSettings,
  onRetry,
}: Props): React.JSX.Element {
  const latestClosing = dashboard.latestClosing;
  const hasData = latestClosing !== null;
  const comparison = dashboard.comparison.changePercentageBasisPoints;
  return (
    <section aria-labelledby="dashboard-title" className="page-stack">
      <header className="page-header dashboard-header">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1 id="dashboard-title">Dashboard</h1>
          <p>Acompanhe sua semana a partir dos fechamentos operacionais.</p>
        </div>
        <button
          className="primary-button"
          onClick={onCreateClosing}
          type="button"
        >
          <AppIcon name="close" />
          Fechar dia
        </button>
      </header>
      {isLoading && (
        <div className="state-card" role="status">
          Carregando indicadores…
        </div>
      )}
      {!isLoading && errorMessage && (
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
      {!isLoading && !errorMessage && !hasData && (
        <div className="empty-panel">
          <div className="empty-panel__icon">
            <AppIcon name="dashboard" />
          </div>
          <p className="eyebrow">Comece por aqui</p>
          <h2>Seu painel ganha vida com o primeiro fechamento</h2>
          <p>
            Registre ganhos, gastos, horas e quilômetros para acompanhar a
            evolução da sua semana.
          </p>
          <button
            className="primary-button"
            onClick={onCreateClosing}
            type="button"
          >
            Registrar primeiro fechamento
          </button>
        </div>
      )}
      {!isLoading && !errorMessage && hasData && (
        <>
          <div className="dashboard-lead">
            <article className="result-card">
              <div>
                <span>Resultado líquido da semana</span>
                <strong
                  className={
                    dashboard.week.netResultCents < 0 ? 'negative-value' : ''
                  }
                >
                  {formatCurrency(dashboard.week.netResultCents)}
                </strong>
                <small>Projeção dos fechamentos diários</small>
              </div>
              <div className="comparison-pill">
                <span>vs. semana anterior</span>
                <strong>
                  {comparison === null
                    ? 'Indisponível'
                    : `${comparison >= 0 ? '+' : ''}${(comparison / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`}
                </strong>
              </div>
            </article>
            {dashboard.weeklyGoal === null ? (
              <article className="goal-card goal-card--empty">
                <p className="eyebrow">Meta semanal</p>
                <h2>Defina seu próximo marco</h2>
                <p>Configure uma meta para visualizar o progresso da semana.</p>
                <button
                  className="text-button"
                  onClick={onOpenSettings}
                  type="button"
                >
                  Configurar meta <AppIcon name="arrow" />
                </button>
              </article>
            ) : (
              <article className="goal-card">
                <div className="goal-card__header">
                  <div>
                    <span>Meta semanal</span>
                    <strong>
                      {formatCurrency(dashboard.weeklyGoal.targetCents)}
                    </strong>
                  </div>
                  <b>
                    {(
                      dashboard.weeklyGoal.progressBasisPoints / 100
                    ).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                    %
                  </b>
                </div>
                <div
                  aria-label="Progresso da meta semanal"
                  className="progress"
                >
                  <span
                    style={{
                      width: `${Math.min(100, Math.max(0, dashboard.weeklyGoal.progressBasisPoints / 100))}%`,
                    }}
                  />
                </div>
                <small>
                  {dashboard.weeklyGoal.remainingCents > 0
                    ? `Faltam ${formatCurrency(dashboard.weeklyGoal.remainingCents)}`
                    : `Excedente de ${formatCurrency(dashboard.weeklyGoal.excessCents)}`}
                </small>
              </article>
            )}
          </div>
          <div className="metric-grid metric-grid--four">
            <Metric
              label="Ganhos"
              value={formatCurrency(dashboard.week.totalEarningsCents)}
            />
            <Metric
              label="Gastos"
              value={formatCurrency(dashboard.week.totalExpensesCents)}
            />
            <Metric
              label="Horas trabalhadas"
              value={formatWorkedTime(dashboard.week.workedSeconds)}
            />
            <Metric
              label="Quilômetros"
              value={formatDistance(dashboard.week.distanceMeters)}
            />
            <Metric
              label="Líquido por hora"
              value={
                dashboard.week.netPerHourCents === null
                  ? 'Indisponível'
                  : formatCurrency(dashboard.week.netPerHourCents)
              }
              detail={
                dashboard.hourlyTarget === null
                  ? 'Referência não configurada'
                  : dashboard.hourlyTarget.differenceCents === null
                    ? `Meta ${formatCurrency(dashboard.hourlyTarget.targetCents)}`
                    : `${dashboard.hourlyTarget.isMet ? 'Acima' : 'Abaixo'} da meta em ${formatCurrency(Math.abs(dashboard.hourlyTarget.differenceCents))}`
              }
            />
            <Metric
              label="Média por dia"
              value={
                dashboard.week.averagePerWorkedDayCents === null
                  ? 'Indisponível'
                  : formatCurrency(dashboard.week.averagePerWorkedDayCents)
              }
            />
            <Metric
              label="Dias trabalhados"
              value={String(dashboard.week.workedDays)}
            />
            <Metric
              label="Fechamentos"
              value={String(dashboard.week.workedDays)}
            />
          </div>
          <article className="latest-card">
            <div>
              <p className="eyebrow">Último fechamento</p>
              <h2>
                {formatOperationalDate(latestClosing?.operationalDate ?? '')}
              </h2>
              <span>
                {formatWorkedTime(latestClosing?.workedSeconds ?? 0)} ·{' '}
                {formatDistance(latestClosing?.summary.distanceMeters ?? 0)}
              </span>
            </div>
            <strong
              className={
                (latestClosing?.summary.netResultCents ?? 0) < 0
                  ? 'negative-value'
                  : 'positive-value'
              }
            >
              {formatCurrency(latestClosing?.summary.netResultCents ?? 0)}
            </strong>
          </article>
        </>
      )}
    </section>
  );
}
