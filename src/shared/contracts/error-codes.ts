import { z } from 'zod';

export const ERROR_CODES = [
  'INVALID_IPC_PAYLOAD',
  'UNAUTHORIZED_IPC_SENDER',
  'FOUNDATION_DIAGNOSTIC_FAILED',
] as const;

export const errorCodeSchema = z.enum(ERROR_CODES);

export type ErrorCode = z.infer<typeof errorCodeSchema>;
