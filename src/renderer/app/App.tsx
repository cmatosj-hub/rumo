import { useState } from 'react';
import { v7 as uuidV7 } from 'uuid';

type DiagnosticStatus = 'checking' | 'error' | 'idle' | 'ready';

export function App(): React.JSX.Element {
  const [diagnosticStatus, setDiagnosticStatus] =
    useState<DiagnosticStatus>('idle');

  async function checkFoundation(): Promise<void> {
    setDiagnosticStatus('checking');

    try {
      const result = await window.rumo.diagnostics.check({
        correlationId: uuidV7(),
      });

      setDiagnosticStatus(result.ok ? 'ready' : 'error');
    } catch {
      setDiagnosticStatus('error');
    }
  }

  return (
    <main className="shell">
      <section aria-labelledby="shell-title" className="shell__card">
        <p className="shell__eyebrow">Fundação técnica</p>
        <h1 id="shell-title">RUMO</h1>
        <p>
          O shell seguro do aplicativo está pronto para receber os módulos do
          MVP nas próximas entregas.
        </p>
        <button
          disabled={diagnosticStatus === 'checking'}
          onClick={() => void checkFoundation()}
          type="button"
        >
          {diagnosticStatus === 'checking'
            ? 'Verificando…'
            : 'Verificar fundação'}
        </button>
        <p aria-live="polite" data-testid="diagnostic-status">
          {diagnosticStatus === 'idle' && 'Diagnóstico ainda não executado.'}
          {diagnosticStatus === 'checking' && 'Diagnóstico em andamento.'}
          {diagnosticStatus === 'ready' && 'Fundação operacional.'}
          {diagnosticStatus === 'error' && 'Diagnóstico indisponível.'}
        </p>
      </section>
    </main>
  );
}
