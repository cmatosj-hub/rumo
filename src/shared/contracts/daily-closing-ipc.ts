import { z } from 'zod';

import { errorCodeSchema } from './error-codes';

export const DAILY_CLOSING_IPC_CHANNELS = {
  create: 'daily-closing:create',
  list: 'daily-closing:list',
} as const;

export const DAILY_CLOSING_IPC_ALLOWLIST = [
  DAILY_CLOSING_IPC_CHANNELS.create,
  DAILY_CLOSING_IPC_CHANNELS.list,
] as const;

const nonnegativeIntegerSchema = z
  .number()
  .int()
  .min(0)
  .max(Number.MAX_SAFE_INTEGER);

export const dailyClosingInputSchema = z
  .object({
    finalOdometerMeters: nonnegativeIntegerSchema,
    foodExpenseCents: nonnegativeIntegerSchema,
    fuelExpenseCents: nonnegativeIntegerSchema,
    initialOdometerMeters: nonnegativeIntegerSchema,
    maintenanceExpenseCents: nonnegativeIntegerSchema,
    ninetyNineEarningsCents: nonnegativeIntegerSchema,
    notes: z.string().trim().max(2000).nullable(),
    operationalDate: z.iso.date(),
    otherExpensesCents: nonnegativeIntegerSchema,
    parkingExpenseCents: nonnegativeIntegerSchema,
    tollExpenseCents: nonnegativeIntegerSchema,
    uberEarningsCents: nonnegativeIntegerSchema,
    workedSeconds: nonnegativeIntegerSchema,
  })
  .strict()
  .refine((value) => value.finalOdometerMeters >= value.initialOdometerMeters, {
    message: 'A quilometragem final deve ser maior ou igual à inicial.',
    path: ['finalOdometerMeters'],
  });

export const dailyClosingSummarySchema = z
  .object({
    distanceMeters: nonnegativeIntegerSchema,
    grossPerHourCents: z.number().int().nullable(),
    netPerHourCents: z.number().int().nullable(),
    netResultCents: z.number().int(),
    totalEarningsCents: nonnegativeIntegerSchema,
    totalExpensesCents: nonnegativeIntegerSchema,
  })
  .strict();

export const dailyClosingRecordSchema = dailyClosingInputSchema.extend({
  createdAtUtc: z.iso.datetime({ offset: true }),
  id: z.uuid(),
  summary: dailyClosingSummarySchema,
  updatedAtUtc: z.iso.datetime({ offset: true }),
});

export const createDailyClosingRequestSchema = z
  .object({
    closing: dailyClosingInputSchema,
    correlationId: z.uuid(),
  })
  .strict();

export const listDailyClosingsRequestSchema = z
  .object({ correlationId: z.uuid() })
  .strict();

const dailyClosingFailureSchema = z
  .object({
    error: z
      .object({
        code: errorCodeSchema,
        correlationId: z.uuid(),
        message: z.string().min(1),
      })
      .strict(),
    ok: z.literal(false),
  })
  .strict();

export const createDailyClosingResponseSchema = z.discriminatedUnion('ok', [
  z.object({ data: dailyClosingRecordSchema, ok: z.literal(true) }).strict(),
  dailyClosingFailureSchema,
]);

export const listDailyClosingsResponseSchema = z.discriminatedUnion('ok', [
  z
    .object({ data: z.array(dailyClosingRecordSchema), ok: z.literal(true) })
    .strict(),
  dailyClosingFailureSchema,
]);

export type CreateDailyClosingRequest = z.infer<
  typeof createDailyClosingRequestSchema
>;
export type CreateDailyClosingResponse = z.infer<
  typeof createDailyClosingResponseSchema
>;
export type DailyClosingInput = z.infer<typeof dailyClosingInputSchema>;
export type DailyClosingRecord = z.infer<typeof dailyClosingRecordSchema>;
export type DailyClosingSummary = z.infer<typeof dailyClosingSummarySchema>;
export type ListDailyClosingsRequest = z.infer<
  typeof listDailyClosingsRequestSchema
>;
export type ListDailyClosingsResponse = z.infer<
  typeof listDailyClosingsResponseSchema
>;
