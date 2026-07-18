import { ApplicationInitializationError } from './application-initialization-error';

export interface StartupErrorDetails {
  readonly cause?: StartupErrorDetails;
  readonly message: string;
  readonly name: string;
  readonly stack?: string;
  readonly stage?: string;
}

export function getStartupErrorCode(error: unknown): string {
  if (error instanceof Error && error.cause !== undefined) {
    const causeCode = getStartupErrorCode(error.cause);

    if (causeCode !== 'APPLICATION_INITIALIZATION_FAILED') {
      return causeCode;
    }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    (error.code.startsWith('DATABASE_') || error.code.startsWith('MIGRATION_'))
  ) {
    return error.code;
  }

  return 'APPLICATION_INITIALIZATION_FAILED';
}

export function getStartupErrorDetails(error: unknown): StartupErrorDetails {
  if (!(error instanceof Error)) {
    return { message: String(error), name: typeof error };
  }

  return {
    ...(error.cause === undefined
      ? {}
      : { cause: getStartupErrorDetails(error.cause) }),
    message: error.message,
    name: error.name,
    ...(error.stack === undefined ? {} : { stack: error.stack }),
    ...(error instanceof ApplicationInitializationError
      ? { stage: error.stage }
      : {}),
  };
}
