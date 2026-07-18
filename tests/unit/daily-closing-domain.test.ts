import { describe, expect, it } from 'vitest';

import {
  DailyClosingValidationError,
  calculateDailyClosingSummary,
} from '../../src/modules/daily-closing/domain/daily-closing';
import {
  normalizeMoneyInput,
  parseDecimalToScaledInteger,
} from '../../src/modules/daily-closing/presentation/formatters';

const validValues = {
  finalOdometerMeters: 125_500,
  foodExpenseCents: 1_500,
  fuelExpenseCents: 5_000,
  initialOdometerMeters: 100_000,
  maintenanceExpenseCents: 0,
  ninetyNineEarningsCents: 7_500,
  otherExpensesCents: 500,
  parkingExpenseCents: 1_000,
  tollExpenseCents: 500,
  uberEarningsCents: 12_500,
  workedSeconds: 18_000,
};

describe('cálculos do fechamento diário', () => {
  it('soma ganhos, gastos, resultado, distância e valores por hora', () => {
    expect(calculateDailyClosingSummary(validValues)).toEqual({
      distanceMeters: 25_500,
      grossPerHourCents: 4_000,
      netPerHourCents: 2_300,
      netResultCents: 11_500,
      totalEarningsCents: 20_000,
      totalExpensesCents: 8_500,
    });
  });

  it('retorna indicadores por hora indisponíveis quando a duração é zero', () => {
    expect(
      calculateDailyClosingSummary({ ...validValues, workedSeconds: 0 }),
    ).toMatchObject({
      grossPerHourCents: null,
      netPerHourCents: null,
    });
  });

  it('converte valores decimais para unidades inteiras sem ponto flutuante', () => {
    expect(parseDecimalToScaledInteger('123,45', 2, 100)).toBe(12_345);
    expect(parseDecimalToScaledInteger('1000.125', 3, 1000)).toBe(1_000_125);
    expect(parseDecimalToScaledInteger('7,25', 2, 3600)).toBe(26_100);
    expect(normalizeMoneyInput('123,4')).toBe('123,40');
  });

  it('rejeita valores negativos, regressão de odômetro e decimais inválidos', () => {
    expect(() =>
      calculateDailyClosingSummary({
        ...validValues,
        finalOdometerMeters: 99_999,
      }),
    ).toThrow(DailyClosingValidationError);
    expect(() =>
      calculateDailyClosingSummary({
        ...validValues,
        fuelExpenseCents: -1,
      }),
    ).toThrow(DailyClosingValidationError);
    expect(parseDecimalToScaledInteger('-1', 2, 100)).toBeNull();
    expect(parseDecimalToScaledInteger('1,234', 2, 100)).toBeNull();
  });
});
