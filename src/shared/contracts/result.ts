import type { ErrorCode } from './error-codes';

export interface ResultError {
  readonly code: ErrorCode;
  readonly correlationId: string;
  readonly message: string;
}

export type Result<T> =
  | { readonly data: T; readonly ok: true }
  | { readonly error: ResultError; readonly ok: false };
