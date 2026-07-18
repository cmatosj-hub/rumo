import { z } from 'zod';

import { errorCodeSchema } from './error-codes';

export const OPERATIONAL_SETTINGS_IPC_CHANNELS = {
  get: 'operational-settings:get',
  update: 'operational-settings:update',
} as const;

export const OPERATIONAL_SETTINGS_IPC_ALLOWLIST = [
  OPERATIONAL_SETTINGS_IPC_CHANNELS.get,
  OPERATIONAL_SETTINGS_IPC_CHANNELS.update,
] as const;

const optionalPositiveCentsSchema = z.number().int().positive().nullable();

export const operationalSettingsSchema = z
  .object({
    minimumHourlyRateCents: optionalPositiveCentsSchema,
    monthlyGoalCents: optionalPositiveCentsSchema,
    updatedAtUtc: z.iso.datetime({ offset: true }).nullable(),
    weeklyGoalCents: optionalPositiveCentsSchema,
    weekStartsOn: z.number().int().min(1).max(7),
  })
  .strict();

export const operationalSettingsInputSchema = operationalSettingsSchema.omit({
  updatedAtUtc: true,
});

const requestBaseSchema = z.object({ correlationId: z.uuid() }).strict();
export const getOperationalSettingsRequestSchema = requestBaseSchema;
export const updateOperationalSettingsRequestSchema = z
  .object({
    correlationId: z.uuid(),
    settings: operationalSettingsInputSchema,
  })
  .strict();

const failureSchema = z
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

export const getOperationalSettingsResponseSchema = z.discriminatedUnion('ok', [
  z.object({ data: operationalSettingsSchema, ok: z.literal(true) }).strict(),
  failureSchema,
]);
export const updateOperationalSettingsResponseSchema =
  getOperationalSettingsResponseSchema;

export type OperationalSettings = z.infer<typeof operationalSettingsSchema>;
export type OperationalSettingsInput = z.infer<
  typeof operationalSettingsInputSchema
>;
export type GetOperationalSettingsRequest = z.infer<
  typeof getOperationalSettingsRequestSchema
>;
export type GetOperationalSettingsResponse = z.infer<
  typeof getOperationalSettingsResponseSchema
>;
export type UpdateOperationalSettingsRequest = z.infer<
  typeof updateOperationalSettingsRequestSchema
>;
export type UpdateOperationalSettingsResponse = z.infer<
  typeof updateOperationalSettingsResponseSchema
>;
