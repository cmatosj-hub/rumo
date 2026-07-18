import { useMemo, useState } from 'react';
import { v7 as uuidV7 } from 'uuid';

import type { DailyClosingInput } from '../../../shared/contracts';
import { calculateDailyClosingSummary } from '../domain/daily-closing';
import {
  currentLocalDate,
  formatCurrency,
  formatDistance,
  parseDecimalToScaledInteger,
} from './formatters';

interface DailyClosingFormProps {
  readonly onSaved: () => Promise<void>;
}

interface FormValues {
  readonly finalOdometer: string;
  readonly foodExpense: string;
  readonly fuelExpense: string;
  readonly initialOdometer: string;
  readonly maintenanceExpense: string;
  readonly ninetyNineEarnings: string;
  readonly notes: string;
  readonly operationalDate: string;
  readonly otherExpenses: string;
  readonly parkingExpense: string;
  readonly tollExpense: string;
  readonly uberEarnings: string;
  readonly workedHours: string;
}

type FormErrors = Partial<Record<keyof FormValues | 'form', string>>;

const initialValues: FormValues = {
  finalOdometer: '0',
  foodExpense: '0,00',
  fuelExpense: '0,00',
  initialOdometer: '0',
  maintenanceExpense: '0,00',
  ninetyNineEarnings: '0,00',
  notes: '',
  operationalDate: currentLocalDate(),
  otherExpenses: '0,00',
  parkingExpense: '0,00',
  tollExpense: '0,00',
  uberEarnings: '0,00',
  workedHours: '0',
};

const moneyFields = [
  ['uberEarnings', 'Ganhos Uber'],
  ['ninetyNineEarnings', 'Ganhos 99'],
  ['fuelExpense', 'Combustível'],
  ['foodExpense', 'Alimentação ou lanche'],
  ['parkingExpense', 'Estacionamento'],
  ['tollExpense', 'Pedágio'],
  ['maintenanceExpense', 'Manutenção'],
  ['otherExpenses', 'Outros gastos'],
] as const;

function parseForm(values: FormValues): {
  readonly errors: FormErrors;
  readonly input: DailyClosingInput | null;
} {
  const errors: FormErrors = {};
  const parsedMoney = Object.fromEntries(
    moneyFields.map(([field, label]) => {
      const parsed = parseDecimalToScaledInteger(values[field], 2, 100);
      if (parsed === null) {
        errors[field] =
          `${label} deve ser um valor não negativo com até duas casas decimais.`;
      }
      return [field, parsed];
    }),
  ) as Record<(typeof moneyFields)[number][0], number | null>;

  if (values.operationalDate.length === 0) {
    errors.operationalDate = 'Informe a data do fechamento.';
  }

  const initialOdometerMeters = parseDecimalToScaledInteger(
    values.initialOdometer,
    3,
    1000,
  );
  const finalOdometerMeters = parseDecimalToScaledInteger(
    values.finalOdometer,
    3,
    1000,
  );
  const workedSeconds = parseDecimalToScaledInteger(
    values.workedHours,
    2,
    3600,
  );

  if (initialOdometerMeters === null) {
    errors.initialOdometer = 'Informe uma quilometragem inicial não negativa.';
  }
  if (finalOdometerMeters === null) {
    errors.finalOdometer = 'Informe uma quilometragem final não negativa.';
  } else if (
    initialOdometerMeters !== null &&
    finalOdometerMeters < initialOdometerMeters
  ) {
    errors.finalOdometer =
      'A quilometragem final não pode ser menor que a inicial.';
  }
  if (workedSeconds === null) {
    errors.workedHours =
      'Informe horas não negativas com até duas casas decimais.';
  }
  if (values.notes.trim().length > 2000) {
    errors.notes = 'As observações devem ter no máximo 2.000 caracteres.';
  }

  if (
    Object.keys(errors).length > 0 ||
    initialOdometerMeters === null ||
    finalOdometerMeters === null ||
    workedSeconds === null ||
    moneyFields.some(([field]) => parsedMoney[field] === null)
  ) {
    return { errors, input: null };
  }

  return {
    errors,
    input: {
      finalOdometerMeters,
      foodExpenseCents: parsedMoney.foodExpense ?? 0,
      fuelExpenseCents: parsedMoney.fuelExpense ?? 0,
      initialOdometerMeters,
      maintenanceExpenseCents: parsedMoney.maintenanceExpense ?? 0,
      ninetyNineEarningsCents: parsedMoney.ninetyNineEarnings ?? 0,
      notes: values.notes.trim().length === 0 ? null : values.notes.trim(),
      operationalDate: values.operationalDate,
      otherExpensesCents: parsedMoney.otherExpenses ?? 0,
      parkingExpenseCents: parsedMoney.parkingExpense ?? 0,
      tollExpenseCents: parsedMoney.tollExpense ?? 0,
      uberEarningsCents: parsedMoney.uberEarnings ?? 0,
      workedSeconds,
    },
  };
}

function FieldError({
  message,
}: {
  readonly message: string | undefined;
}): React.JSX.Element | null {
  return message === undefined ? null : (
    <span className="field-error">{message}</span>
  );
}

export function DailyClosingForm({
  onSaved,
}: DailyClosingFormProps): React.JSX.Element {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const parsed = useMemo(() => parseForm(values), [values]);
  const summary =
    parsed.input === null ? null : calculateDailyClosingSummary(parsed.input);

  function updateValue(field: keyof FormValues, value: string): void {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors(
      (current) =>
        Object.fromEntries(
          Object.entries(current).filter(
            ([key]) => key !== field && key !== 'form',
          ),
        ) as FormErrors,
    );
  }

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    const result = parseForm(values);
    if (result.input === null) {
      setErrors(result.errors);
      return;
    }

    setIsSaving(true);
    setErrors({});
    try {
      const response = await window.rumo.dailyClosings.create({
        closing: result.input,
        correlationId: uuidV7(),
      });

      if (!response.ok) {
        setErrors({ form: response.error.message });
        return;
      }

      setValues({ ...initialValues, operationalDate: currentLocalDate() });
      await onSaved();
    } catch {
      setErrors({
        form: 'Não foi possível salvar o fechamento. Seus dados foram mantidos.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section aria-labelledby="daily-closing-title" className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Rotina diária</p>
          <h1 id="daily-closing-title">Fechar dia</h1>
          <p>Registre ganhos, gastos e o trabalho realizado no dia.</p>
        </div>
      </header>

      <form
        className="closing-layout"
        noValidate
        onSubmit={(event) => void submit(event)}
      >
        <div className="form-card">
          <fieldset>
            <legend>Identificação</legend>
            <label className="field">
              <span>Data do fechamento</span>
              <input
                aria-describedby={
                  errors.operationalDate === undefined
                    ? undefined
                    : 'operationalDate-error'
                }
                aria-invalid={errors.operationalDate !== undefined}
                onChange={(event) =>
                  updateValue('operationalDate', event.target.value)
                }
                required
                type="date"
                value={values.operationalDate}
              />
              <span id="operationalDate-error">
                <FieldError message={errors.operationalDate} />
              </span>
            </label>
          </fieldset>

          <fieldset>
            <legend>Ganhos</legend>
            <div className="field-grid">
              {moneyFields.slice(0, 2).map(([field, label]) => (
                <label className="field" key={field}>
                  <span>{label}</span>
                  <span className="money-input">
                    <span>R$</span>
                    <input
                      inputMode="decimal"
                      onChange={(event) =>
                        updateValue(field, event.target.value)
                      }
                      value={values[field]}
                    />
                  </span>
                  <FieldError message={errors[field]} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Gastos</legend>
            <div className="field-grid">
              {moneyFields.slice(2).map(([field, label]) => (
                <label className="field" key={field}>
                  <span>{label}</span>
                  <span className="money-input">
                    <span>R$</span>
                    <input
                      inputMode="decimal"
                      onChange={(event) =>
                        updateValue(field, event.target.value)
                      }
                      value={values[field]}
                    />
                  </span>
                  <FieldError message={errors[field]} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Trabalho</legend>
            <div className="field-grid field-grid--three">
              <label className="field">
                <span>Quilômetros iniciais</span>
                <input
                  inputMode="decimal"
                  onChange={(event) =>
                    updateValue('initialOdometer', event.target.value)
                  }
                  value={values.initialOdometer}
                />
                <FieldError message={errors.initialOdometer} />
              </label>
              <label className="field">
                <span>Quilômetros finais</span>
                <input
                  inputMode="decimal"
                  onChange={(event) =>
                    updateValue('finalOdometer', event.target.value)
                  }
                  value={values.finalOdometer}
                />
                <FieldError message={errors.finalOdometer} />
              </label>
              <label className="field">
                <span>Horas líquidas trabalhadas</span>
                <input
                  inputMode="decimal"
                  onChange={(event) =>
                    updateValue('workedHours', event.target.value)
                  }
                  value={values.workedHours}
                />
                <FieldError message={errors.workedHours} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Observações</legend>
            <label className="field">
              <span>Observações do dia (opcional)</span>
              <textarea
                maxLength={2000}
                onChange={(event) => updateValue('notes', event.target.value)}
                rows={4}
                value={values.notes}
              />
              <FieldError message={errors.notes} />
            </label>
          </fieldset>

          {errors.form !== undefined && (
            <div className="feedback feedback--error" role="alert">
              {errors.form}
            </div>
          )}
          <button className="primary-button" disabled={isSaving} type="submit">
            {isSaving ? 'Salvando…' : 'Salvar fechamento'}
          </button>
        </div>

        <aside aria-label="Resumo do fechamento" className="summary-card">
          <p className="eyebrow">Resumo automático</p>
          <h2>Resultado do dia</h2>
          {summary === null ? (
            <p className="muted">
              Revise os campos inválidos para calcular o resumo.
            </p>
          ) : (
            <dl className="summary-list">
              <div>
                <dt>Ganhos totais</dt>
                <dd>{formatCurrency(summary.totalEarningsCents)}</dd>
              </div>
              <div>
                <dt>Gastos totais</dt>
                <dd>{formatCurrency(summary.totalExpensesCents)}</dd>
              </div>
              <div className="summary-list__highlight">
                <dt>Resultado líquido</dt>
                <dd>{formatCurrency(summary.netResultCents)}</dd>
              </div>
              <div>
                <dt>Quilômetros rodados</dt>
                <dd>{formatDistance(summary.distanceMeters)}</dd>
              </div>
              <div>
                <dt>Valor bruto por hora</dt>
                <dd>
                  {summary.grossPerHourCents === null
                    ? 'Indisponível'
                    : formatCurrency(summary.grossPerHourCents)}
                </dd>
              </div>
              <div>
                <dt>Valor líquido por hora</dt>
                <dd>
                  {summary.netPerHourCents === null
                    ? 'Indisponível'
                    : formatCurrency(summary.netPerHourCents)}
                </dd>
              </div>
            </dl>
          )}
        </aside>
      </form>
    </section>
  );
}
