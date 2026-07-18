import { describe, expect, it } from 'vitest';

import { ApplicationInitializationError } from '../../src/main/bootstrap/application-initialization-error';
import {
  getStartupErrorCode,
  getStartupErrorDetails,
} from '../../src/main/bootstrap/startup-diagnostics';

describe('diagnóstico da inicialização', () => {
  it('preserva etapa, exceção original e stack no log técnico', () => {
    const originalError = new Error('native module ABI mismatch');
    const startupError = new ApplicationInitializationError(
      'loading-database-infrastructure',
      originalError,
    );

    expect(getStartupErrorDetails(startupError)).toMatchObject({
      cause: {
        message: 'native module ABI mismatch',
        name: 'Error',
        stack: expect.stringContaining('native module ABI mismatch'),
      },
      message: expect.stringContaining('loading-database-infrastructure'),
      name: 'ApplicationInitializationError',
      stack: expect.stringContaining('ApplicationInitializationError'),
      stage: 'loading-database-infrastructure',
    });
  });

  it('encontra códigos controlados mesmo quando a falha possui causa', () => {
    const databaseError = Object.assign(new Error('internal detail'), {
      code: 'DATABASE_CONNECTION_FAILED',
    });
    const startupError = new ApplicationInitializationError(
      'connecting-database',
      databaseError,
    );

    expect(getStartupErrorCode(startupError)).toBe(
      'DATABASE_CONNECTION_FAILED',
    );
    expect(getStartupErrorCode(new Error('unknown'))).toBe(
      'APPLICATION_INITIALIZATION_FAILED',
    );
  });
});
