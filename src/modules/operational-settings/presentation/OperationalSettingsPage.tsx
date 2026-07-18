import { useEffect, useState } from 'react';
import { v7 as uuidV7 } from 'uuid';
import type { OperationalSettings } from '../../../shared/contracts';
import {
  formatCurrency,
  parseDecimalToScaledInteger,
} from '../../daily-closing/presentation/formatters';

interface Props {
  readonly settings: OperationalSettings;
  readonly onSaved: (settings: OperationalSettings) => void;
}
function toInput(cents: number | null): string {
  return cents === null ? '' : (cents / 100).toFixed(2).replace('.', ',');
}
function parseOptional(value: string): number | null | undefined {
  if (value.trim() === '') return null;
  const parsed = parseDecimalToScaledInteger(value, 2, 100);
  return parsed !== null && parsed > 0 ? parsed : undefined;
}

export function OperationalSettingsPage({
  settings,
  onSaved,
}: Props): React.JSX.Element {
  const [weekly, setWeekly] = useState(toInput(settings.weeklyGoalCents));
  const [monthly, setMonthly] = useState(toInput(settings.monthlyGoalCents));
  const [hourly, setHourly] = useState(
    toInput(settings.minimumHourlyRateCents),
  );
  const [weekStartsOn, setWeekStartsOn] = useState(settings.weekStartsOn);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setWeekly(toInput(settings.weeklyGoalCents));
    setMonthly(toInput(settings.monthlyGoalCents));
    setHourly(toInput(settings.minimumHourlyRateCents));
    setWeekStartsOn(settings.weekStartsOn);
  }, [settings]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const values = [
      parseOptional(weekly),
      parseOptional(monthly),
      parseOptional(hourly),
    ];
    const [weeklyValue, monthlyValue, hourlyValue] = values;
    if (
      weeklyValue === undefined ||
      monthlyValue === undefined ||
      hourlyValue === undefined
    ) {
      setMessage('Informe valores positivos ou deixe o campo vazio.');
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await window.rumo.operationalSettings.update({
        correlationId: uuidV7(),
        settings: {
          weeklyGoalCents: weeklyValue,
          monthlyGoalCents: monthlyValue,
          minimumHourlyRateCents: hourlyValue,
          weekStartsOn,
        },
      });
      if (!response.ok) {
        setMessage(response.error.message);
        return;
      }
      onSaved(response.data);
      setMessage('Configurações salvas com sucesso.');
    } catch {
      setMessage('Não foi possível salvar as configurações.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <section aria-labelledby="settings-title" className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Preferências</p>
          <h1 id="settings-title">Configurações</h1>
          <p>Personalize metas e referências para sua rotina.</p>
        </div>
      </header>
      <form className="settings-card" onSubmit={(event) => void submit(event)}>
        <div className="settings-section">
          <div>
            <h2>Metas operacionais</h2>
            <p>Campos opcionais. O dashboard continua funcionando sem metas.</p>
          </div>
          <div className="field-grid">
            <label className="field">
              <span>Meta semanal</span>
              <span className="money-input">
                <span>R$</span>
                <input
                  aria-label="Meta semanal"
                  inputMode="decimal"
                  onChange={(e) => setWeekly(e.target.value)}
                  value={weekly}
                />
              </span>
            </label>
            <label className="field">
              <span>Meta mensal (opcional)</span>
              <span className="money-input">
                <span>R$</span>
                <input
                  aria-label="Meta mensal"
                  inputMode="decimal"
                  onChange={(e) => setMonthly(e.target.value)}
                  value={monthly}
                />
              </span>
            </label>
            <label className="field">
              <span>Mínimo líquido desejado por hora</span>
              <span className="money-input">
                <span>R$</span>
                <input
                  aria-label="Mínimo líquido desejado por hora"
                  inputMode="decimal"
                  onChange={(e) => setHourly(e.target.value)}
                  value={hourly}
                />
              </span>
            </label>
            <label className="field">
              <span>Início da semana</span>
              <select
                aria-label="Início da semana"
                onChange={(e) => setWeekStartsOn(Number(e.target.value))}
                value={weekStartsOn}
              >
                {[
                  'Segunda-feira',
                  'Terça-feira',
                  'Quarta-feira',
                  'Quinta-feira',
                  'Sexta-feira',
                  'Sábado',
                  'Domingo',
                ].map((label, index) => (
                  <option key={label} value={index + 1}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {message && (
          <div
            className={
              message.includes('sucesso')
                ? 'feedback feedback--success'
                : 'feedback feedback--error'
            }
            role="status"
          >
            {message}
          </div>
        )}
        <div className="settings-actions">
          <small>
            {settings.updatedAtUtc
              ? `Última atualização registrada · Meta atual ${settings.weeklyGoalCents === null ? 'não definida' : formatCurrency(settings.weeklyGoalCents)}`
              : 'Preferências ainda não salvas'}
          </small>
          <button className="primary-button" disabled={saving} type="submit">
            {saving ? 'Salvando…' : 'Salvar configurações'}
          </button>
        </div>
      </form>
    </section>
  );
}
