import type {
  DailyClosingRecord,
  OperationalSettings,
} from '../../../shared/contracts';

export type ClosingPeriodFilter = 'week' | 'month' | 'all';

export interface DashboardSnapshot {
  readonly hourlyTarget: null | {
    readonly differenceCents: number | null;
    readonly isMet: boolean | null;
    readonly targetCents: number;
  };
  readonly comparison: {
    readonly changeCents: number;
    readonly changePercentageBasisPoints: number | null;
    readonly previousNetResultCents: number;
  };
  readonly latestClosing: DailyClosingRecord | null;
  readonly week: {
    readonly averagePerWorkedDayCents: number | null;
    readonly distanceMeters: number;
    readonly netPerHourCents: number | null;
    readonly netResultCents: number;
    readonly totalEarningsCents: number;
    readonly totalExpensesCents: number;
    readonly workedDays: number;
    readonly workedSeconds: number;
  };
  readonly weeklyGoal: null | {
    readonly excessCents: number;
    readonly progressBasisPoints: number;
    readonly remainingCents: number;
    readonly targetCents: number;
  };
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function dateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function startOfWeek(today: string, weekStartsOn: number): Date {
  const date = parseDate(today);
  const isoDay = date.getUTCDay() === 0 ? 7 : date.getUTCDay();
  const offset = (isoDay - weekStartsOn + 7) % 7;
  return addDays(date, -offset);
}

function inRange(record: DailyClosingRecord, start: Date, end: Date): boolean {
  return (
    record.operationalDate >= dateString(start) &&
    record.operationalDate < dateString(end)
  );
}

function roundRatio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : Math.round(numerator / denominator);
}

function aggregate(closings: readonly DailyClosingRecord[]) {
  return closings.reduce(
    (result, closing) => ({
      distanceMeters: result.distanceMeters + closing.summary.distanceMeters,
      netResultCents: result.netResultCents + closing.summary.netResultCents,
      totalEarningsCents:
        result.totalEarningsCents + closing.summary.totalEarningsCents,
      totalExpensesCents:
        result.totalExpensesCents + closing.summary.totalExpensesCents,
      workedSeconds: result.workedSeconds + closing.workedSeconds,
    }),
    {
      distanceMeters: 0,
      netResultCents: 0,
      totalEarningsCents: 0,
      totalExpensesCents: 0,
      workedSeconds: 0,
    },
  );
}

export function calculateOperationalDashboard(input: {
  readonly closings: readonly DailyClosingRecord[];
  readonly settings: OperationalSettings;
  readonly today: string;
}): DashboardSnapshot {
  const currentStart = startOfWeek(input.today, input.settings.weekStartsOn);
  const currentEnd = addDays(currentStart, 7);
  const previousStart = addDays(currentStart, -7);
  const currentClosings = input.closings.filter((record) =>
    inRange(record, currentStart, currentEnd),
  );
  const previousClosings = input.closings.filter((record) =>
    inRange(record, previousStart, currentStart),
  );
  const current = aggregate(currentClosings);
  const previous = aggregate(previousClosings);
  const changeCents = current.netResultCents - previous.netResultCents;
  const changePercentageBasisPoints =
    previous.netResultCents === 0
      ? current.netResultCents === 0
        ? 0
        : null
      : Math.round((changeCents / Math.abs(previous.netResultCents)) * 10_000);
  const goal = input.settings.weeklyGoalCents;

  return {
    comparison: {
      changeCents,
      changePercentageBasisPoints,
      previousNetResultCents: previous.netResultCents,
    },
    latestClosing: input.closings[0] ?? null,
    hourlyTarget:
      input.settings.minimumHourlyRateCents === null
        ? null
        : {
            differenceCents:
              current.workedSeconds === 0
                ? null
                : Math.round(
                    (current.netResultCents * 3600) / current.workedSeconds,
                  ) - input.settings.minimumHourlyRateCents,
            isMet:
              current.workedSeconds === 0
                ? null
                : Math.round(
                    (current.netResultCents * 3600) / current.workedSeconds,
                  ) >= input.settings.minimumHourlyRateCents,
            targetCents: input.settings.minimumHourlyRateCents,
          },
    week: {
      ...current,
      averagePerWorkedDayCents: roundRatio(
        current.netResultCents,
        currentClosings.length,
      ),
      netPerHourCents:
        current.workedSeconds === 0
          ? null
          : Math.round((current.netResultCents * 3600) / current.workedSeconds),
      workedDays: currentClosings.length,
    },
    weeklyGoal:
      goal === null
        ? null
        : {
            excessCents: Math.max(0, current.netResultCents - goal),
            progressBasisPoints: Math.round(
              (current.netResultCents / goal) * 10_000,
            ),
            remainingCents: Math.max(0, goal - current.netResultCents),
            targetCents: goal,
          },
  };
}

export function filterDailyClosings(input: {
  readonly closings: readonly DailyClosingRecord[];
  readonly period: ClosingPeriodFilter;
  readonly searchDate: string;
  readonly today: string;
  readonly weekStartsOn: number;
}): DailyClosingRecord[] {
  let records = [...input.closings];
  if (input.searchDate !== '') {
    records = records.filter(
      (record) => record.operationalDate === input.searchDate,
    );
  }
  if (input.period === 'all') return records;
  const today = parseDate(input.today);
  const start =
    input.period === 'week'
      ? startOfWeek(input.today, input.weekStartsOn)
      : new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const end =
    input.period === 'week'
      ? addDays(start, 7)
      : new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1));
  return records.filter((record) => inRange(record, start, end));
}
