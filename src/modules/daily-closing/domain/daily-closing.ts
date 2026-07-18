export interface DailyClosingValues {
  readonly finalOdometerMeters: number;
  readonly foodExpenseCents: number;
  readonly fuelExpenseCents: number;
  readonly initialOdometerMeters: number;
  readonly maintenanceExpenseCents: number;
  readonly ninetyNineEarningsCents: number;
  readonly otherExpensesCents: number;
  readonly parkingExpenseCents: number;
  readonly tollExpenseCents: number;
  readonly uberEarningsCents: number;
  readonly workedSeconds: number;
}

export interface DailyClosingCalculatedSummary {
  readonly distanceMeters: number;
  readonly grossPerHourCents: number | null;
  readonly netPerHourCents: number | null;
  readonly netResultCents: number;
  readonly totalEarningsCents: number;
  readonly totalExpensesCents: number;
}

export class DailyClosingValidationError extends Error {
  constructor() {
    super('Os dados do fechamento diário são inválidos.');
    this.name = 'DailyClosingValidationError';
  }
}

const moneyFields: readonly (keyof DailyClosingValues)[] = [
  'uberEarningsCents',
  'ninetyNineEarningsCents',
  'fuelExpenseCents',
  'foodExpenseCents',
  'parkingExpenseCents',
  'tollExpenseCents',
  'maintenanceExpenseCents',
  'otherExpensesCents',
];

function roundHalfAwayFromZero(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value));
}

function sumSafe(values: readonly number[]): number {
  const total = values.reduce((sum, value) => sum + value, 0);

  if (!Number.isSafeInteger(total)) {
    throw new DailyClosingValidationError();
  }

  return total;
}

export function assertDailyClosingValues(values: DailyClosingValues): void {
  const allValues = [
    ...moneyFields.map((field) => values[field]),
    values.initialOdometerMeters,
    values.finalOdometerMeters,
    values.workedSeconds,
  ];

  if (
    allValues.some((value) => !Number.isSafeInteger(value) || value < 0) ||
    values.finalOdometerMeters < values.initialOdometerMeters
  ) {
    throw new DailyClosingValidationError();
  }
}

export function calculateDailyClosingSummary(
  values: DailyClosingValues,
): DailyClosingCalculatedSummary {
  assertDailyClosingValues(values);

  const totalEarningsCents = sumSafe([
    values.uberEarningsCents,
    values.ninetyNineEarningsCents,
  ]);
  const totalExpensesCents = sumSafe([
    values.fuelExpenseCents,
    values.foodExpenseCents,
    values.parkingExpenseCents,
    values.tollExpenseCents,
    values.maintenanceExpenseCents,
    values.otherExpensesCents,
  ]);
  const netResultCents = totalEarningsCents - totalExpensesCents;

  if (!Number.isSafeInteger(netResultCents)) {
    throw new DailyClosingValidationError();
  }

  return {
    distanceMeters: values.finalOdometerMeters - values.initialOdometerMeters,
    grossPerHourCents:
      values.workedSeconds === 0
        ? null
        : roundHalfAwayFromZero(
            (totalEarningsCents * 3600) / values.workedSeconds,
          ),
    netPerHourCents:
      values.workedSeconds === 0
        ? null
        : roundHalfAwayFromZero((netResultCents * 3600) / values.workedSeconds),
    netResultCents,
    totalEarningsCents,
    totalExpensesCents,
  };
}
