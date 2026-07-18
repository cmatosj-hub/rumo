import { useCallback, useEffect, useState } from 'react';
import { v7 as uuidV7 } from 'uuid';

import { DailyClosingDashboard } from '../../modules/daily-closing/presentation/DailyClosingDashboard';
import { DailyClosingForm } from '../../modules/daily-closing/presentation/DailyClosingForm';
import { DailyClosingList } from '../../modules/daily-closing/presentation/DailyClosingList';
import type { DailyClosingRecord } from '../../shared/contracts';

type Page = 'dashboard' | 'new-closing' | 'closings';

const navigationItems: readonly {
  readonly label: string;
  readonly page: Page;
}[] = [
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Fechar dia', page: 'new-closing' },
  { label: 'Fechamentos', page: 'closings' },
];

export function App(): React.JSX.Element {
  const [page, setPage] = useState<Page>('dashboard');
  const [closings, setClosings] = useState<DailyClosingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadClosings = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await window.rumo.dailyClosings.list({
        correlationId: uuidV7(),
      });
      if (!response.ok) {
        setErrorMessage(response.error.message);
        return;
      }
      setClosings(response.data);
    } catch {
      setErrorMessage('Não foi possível consultar os dados locais.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadClosings(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadClosings]);

  function navigate(destination: Page): void {
    setPage(destination);
    setSuccessMessage(null);
  }

  async function handleSaved(): Promise<void> {
    await loadClosings();
    setSuccessMessage('Fechamento salvo com sucesso.');
    setPage('closings');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            R
          </span>
          <div>
            <strong>RUMO</strong>
            <small>Controle operacional</small>
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
              {item.label}
            </button>
          ))}
        </nav>
        <p className="sidebar__footer">Dados salvos neste dispositivo</p>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && (
          <DailyClosingDashboard
            closings={closings}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onCreateClosing={() => navigate('new-closing')}
            onRetry={loadClosings}
          />
        )}
        {page === 'new-closing' && <DailyClosingForm onSaved={handleSaved} />}
        {page === 'closings' && (
          <DailyClosingList
            closings={closings}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onRetry={loadClosings}
            successMessage={successMessage}
          />
        )}
      </main>
    </div>
  );
}
