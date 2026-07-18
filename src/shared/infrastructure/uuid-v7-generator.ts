import { v7 as uuidV7 } from 'uuid';

import type { IdentifierGenerator } from '../domain/identifier-generator';

export class UuidV7Generator implements IdentifierGenerator {
  generate(): string {
    return uuidV7();
  }
}
