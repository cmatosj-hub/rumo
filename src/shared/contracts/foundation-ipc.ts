import { z } from 'zod';

import { errorCodeSchema } from './error-codes';

export const FOUNDATION_IPC_CHANNELS = {
  diagnosticsCheck: 'foundation:diagnostics:check',
} as const;

export const FOUNDATION_IPC_ALLOWLIST = [
  FOUNDATION_IPC_CHANNELS.diagnosticsCheck,
] as const;

export type FoundationIpcChannel = (typeof FOUNDATION_IPC_ALLOWLIST)[number];

export const foundationDiagnosticRequestSchema = z
  .object({
    correlationId: z.uuid(),
  })
  .strict();

export const foundationDiagnosticDataSchema = z
  .object({
    applicationVersion: z.string().min(1),
    correlationId: z.uuid(),
    electronVersion: z.string().min(1),
    nodeVersion: z.string().min(1),
    status: z.literal('ready'),
    timestampUtc: z.iso.datetime({ offset: true }),
  })
  .strict();

const foundationDiagnosticSuccessSchema = z
  .object({
    data: foundationDiagnosticDataSchema,
    ok: z.literal(true),
  })
  .strict();

const foundationDiagnosticFailureSchema = z
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

export const foundationDiagnosticResponseSchema = z.discriminatedUnion('ok', [
  foundationDiagnosticSuccessSchema,
  foundationDiagnosticFailureSchema,
]);

export type FoundationDiagnosticRequest = z.infer<
  typeof foundationDiagnosticRequestSchema
>;
export type FoundationDiagnosticResponse = z.infer<
  typeof foundationDiagnosticResponseSchema
>;
