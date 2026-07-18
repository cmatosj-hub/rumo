import { describe, expect, it } from 'vitest';
import {
  calculateOperationalDashboard,
  filterDailyClosings,
} from '../../src/modules/dashboard/domain/operational-dashboard';
import type {
  DailyClosingRecord,
  OperationalSettings,
} from '../../src/shared/contracts';

function closing(
  date: string,
  net: number,
  earnings = 10_000,
  expenses = earnings - net,
): DailyClosingRecord {
  return {
    createdAtUtc: `${date}T12:00:00.000Z`,
    finalOdometerMeters: 110_000,
    foodExpenseCents: 0,
    fuelExpenseCents: expenses,
    id: `018f7c00-0000-7000-8000-${date.replaceAll('-', '').padEnd(12, '0')}`,
    initialOdometerMeters: 100_000,
    maintenanceExpenseCents: 0,
    ninetyNineEarningsCents: 0,
    notes: null,
    operationalDate: date,
    otherExpensesCents: 0,
    parkingExpenseCents: 0,
    summary: {
      distanceMeters: 10_000,
      grossPerHourCents: earnings,
      netPerHourCents: net,
      netResultCents: net,
      totalEarningsCents: earnings,
      totalExpensesCents: expenses,
    },
    tollExpenseCents: 0,
    uberEarningsCents: earnings,
    updatedAtUtc: `${date}T12:00:00.000Z`,
    workedSeconds: 3600,
  };
}
const settings: OperationalSettings = {
  minimumHourlyRateCents: 3_000,
  monthlyGoalCents: null,
  updatedAtUtc: null,
  weeklyGoalCents: 20_000,
  weekStartsOn: 1,
};

describe('dashboard operacional', () => {
  it('calcula indicadores, meta e comparação semanal no domínio', () => {
    const result = calculateOperationalDashboard({
      closings: [
        closing('2026-07-15', 12_000),
        closing('2026-07-14', 6_000),
        closing('2026-07-07', 10_000),
      ],
      settings,
      today: '2026-07-18',
    });
    expect(result.week).toMatchObject({
      averagePerWorkedDayCents: 9_000,
      distanceMeters: 20_000,
      netPerHourCents: 9_000,
      netResultCents: 18_000,
      workedDays: 2,
      workedSeconds: 7200,
    });
    expect(result.weeklyGoal).toEqual({
      excessCents: 0,
      progressBasisPoints: 9_000,
      remainingCents: 2_000,
      targetCents: 20_000,
    });
    expect(result.hourlyTarget).toEqual({
      differenceCents: 6_000,
      isMet: true,
      targetCents: 3_000,
    });
    expect(result.comparison).toEqual({
      changeCents: 8_000,
      changePercentageBasisPoints: 8_000,
      previousNetResultCents: 10_000,
    });
  });

  it('mantém meta opcional e comparação indisponível com base zero', () => {
    const result = calculateOperationalDashboard({
      closings: [closing('2026-07-15', 1_000)],
      settings: { ...settings, weeklyGoalCents: null },
      today: '2026-07-18',
    });
    expect(result.weeklyGoal).toBeNull();
    expect(result.comparison.changePercentageBasisPoints).toBeNull();
  });

  it('filtra por semana, mês, todos e data exata', () => {
    const records = [
      closing('2026-07-15', 1),
      closing('2026-07-03', 1),
      closing('2026-06-30', 1),
    ];
    expect(
      filterDailyClosings({
        closings: records,
        period: 'week',
        searchDate: '',
        today: '2026-07-18',
        weekStartsOn: 1,
      }),
    ).toHaveLength(1);
    expect(
      filterDailyClosings({
        closings: records,
        period: 'month',
        searchDate: '',
        today: '2026-07-18',
        weekStartsOn: 1,
      }),
    ).toHaveLength(2);
    expect(
      filterDailyClosings({
        closings: records,
        period: 'all',
        searchDate: '2026-06-30',
        today: '2026-07-18',
        weekStartsOn: 1,
      }),
    ).toHaveLength(1);
  });
});
