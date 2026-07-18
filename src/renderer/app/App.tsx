import { useCallback, useEffect, useMemo, useState } from 'react';
import { v7 as uuidV7 } from 'uuid';
import { calculateOperationalDashboard } from '../../modules/dashboard/domain/operational-dashboard';
import { DailyClosingDashboard } from '../../modules/daily-closing/presentation/DailyClosingDashboard';
import { DailyClosingForm } from '../../modules/daily-closing/presentation/DailyClosingForm';
import { DailyClosingList } from '../../modules/daily-closing/presentation/DailyClosingList';
import { currentLocalDate } from '../../modules/daily-closing/presentation/formatters';
import { OperationalSettingsPage } from '../../modules/operational-settings/presentation/OperationalSettingsPage';
import type {
  DailyClosingRecord,
  OperationalSettings,
} from '../../shared/contracts';
import { AppIcon } from '../components/AppIcon';

type Page = 'dashboard' | 'new-closing' | 'closings' | 'settings';
const defaultSettings: OperationalSettings = {
  minimumHourlyRateCents: null,
  monthlyGoalCents: null,
  updatedAtUtc: null,
  weeklyGoalCents: null,
  weekStartsOn: 1,
};
const navigationItems = [
  { label: 'Dashboard', page: 'dashboard', icon: 'dashboard' },
  { label: 'Fechar dia', page: 'new-closing', icon: 'close' },
  { label: 'Fechamentos', page: 'closings', icon: 'history' },
  { label: 'Configurações', page: 'settings', icon: 'settings' },
] as const;

export function App(): React.JSX.Element {
  const [page, setPage] = useState<Page>('dashboard');
  const [closings, setClosings] = useState<DailyClosingRecord[]>([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [closingResponse, settingsResponse] = await Promise.all([
        window.rumo.dailyClosings.list({ correlationId: uuidV7() }),
        window.rumo.operationalSettings.get({ correlationId: uuidV7() }),
      ]);
      if (!closingResponse.ok) {
        setErrorMessage(closingResponse.error.message);
        return;
      }
      if (!settingsResponse.ok) {
        setErrorMessage(settingsResponse.error.message);
        return;
      }
      setClosings(closingResponse.data);
      setSettings(settingsResponse.data);
    } catch {
      setErrorMessage('Não foi possível consultar os dados locais.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const timeout = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadData]);
  const dashboard = useMemo(
    () =>
      calculateOperationalDashboard({
        closings,
        settings,
        today: currentLocalDate(),
      }),
    [closings, settings],
  );
  function navigate(destination: Page) {
    setPage(destination);
    setSuccessMessage(null);
  }
  async function handleSaved() {
    await loadData();
    setSuccessMessage('Fechamento salvo com sucesso.');
    setPage('closings');
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__mark">R</span>
          <div>
            <strong>RUMO</strong>
            <small>Gestão para motoristas</small>
          </div>
        </div>
        <nav aria-label="Navegação principal">
          {navigationItems.map((item) => (
            <button
              aria-current={page === item.page ? 'page' : undefined}
              className="nav-item"
              key={item.page}
              onClick={() => navigate(item.page)}
              type="button"
            >
              <AppIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <span className="status-dot" />
          Dados protegidos neste dispositivo
        </div>
      </aside>
      <main className="main-content">
        {page === 'dashboard' && (
          <DailyClosingDashboard
            dashboard={dashboard}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onCreateClosing={() => navigate('new-closing')}
            onOpenSettings={() => navigate('settings')}
            onRetry={loadData}
          />
        )}
        {page === 'new-closing' && <DailyClosingForm onSaved={handleSaved} />}
        {page === 'closings' && (
          <DailyClosingList
            closings={closings}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onRetry={loadData}
            successMessage={successMessage}
            weekStartsOn={settings.weekStartsOn}
          />
        )}
        {page === 'settings' && (
          <OperationalSettingsPage onSaved={setSettings} settings={settings} />
        )}
      </main>
    </div>
  );
}
