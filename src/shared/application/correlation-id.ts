import type { IdentifierGenerator } from '../domain/identifier-generator';

export type CorrelationId = string & { readonly __brand: 'CorrelationId' };

export function createCorrelationId(
  identifierGenerator: IdentifierGenerator,
): CorrelationId {
  return identifierGenerator.generate() as CorrelationId;
}
