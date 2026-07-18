import { validate as validateUuid, version as uuidVersion } from 'uuid';
import { describe, expect, it } from 'vitest';

import { createCorrelationId } from '../../src/shared/application/correlation-id';
import { SystemClock } from '../../src/shared/infrastructure/system-clock';
import { UuidV7Generator } from '../../src/shared/infrastructure/uuid-v7-generator';

describe('primitivas fundacionais', () => {
  it('gera identificadores UUID versão 7', () => {
    const identifier = new UuidV7Generator().generate();

    expect(validateUuid(identifier)).toBe(true);
    expect(uuidVersion(identifier)).toBe(7);
  });

  it('cria correlationId usando o gerador injetado', () => {
    const correlationId = createCorrelationId({
      generate: () => '018f6b2d-89ab-7def-8123-456789abcdef',
    });

    expect(correlationId).toBe('018f6b2d-89ab-7def-8123-456789abcdef');
  });

  it('fornece um instante válido pelo relógio do sistema', () => {
    expect(new SystemClock().now()).toBeInstanceOf(Date);
  });
});
