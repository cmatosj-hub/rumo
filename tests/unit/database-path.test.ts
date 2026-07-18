// @vitest-environment node

import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  resolveDatabasePath,
  toSqliteUrl,
} from '../../src/shared/infrastructure/database/database-path';

describe('caminho do banco', () => {
  it('resolve o banco abaixo do diretório userData injetado', () => {
    const userDataPath = path.join('C:', 'Users', 'tester', 'RUMO');

    expect(resolveDatabasePath(userDataPath)).toBe(
      path.join(userDataPath, 'data', 'rumo.db'),
    );
  });

  it('converte o caminho para uma URL SQLite portátil', () => {
    expect(toSqliteUrl('C:\\Temp\\RUMO\\data\\rumo.db')).toBe(
      'file:C:/Temp/RUMO/data/rumo.db',
    );
  });

  it('rejeita diretório userData vazio', () => {
    expect(() => resolveDatabasePath('  ')).toThrow(
      'O diretório de dados da aplicação é obrigatório.',
    );
  });
});
