import type { ErrorCode } from '../contracts/error-codes';

export interface LogEvent {
  readonly correlationId?: string;
  readonly errorCode?: ErrorCode;
  readonly message: string;
  readonly module: string;
  readonly timestampUtc: string;
}

export interface SanitizedLogger {
  debug(event: LogEvent): void;
  error(event: LogEvent): void;
  info(event: LogEvent): void;
  warn(event: LogEvent): void;
}
