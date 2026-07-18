import path from 'node:path';

const DATABASE_DIRECTORY = 'data';
const DATABASE_FILE = 'rumo.db';

export function resolveDatabasePath(userDataPath: string): string {
  if (userDataPath.trim().length === 0) {
    throw new Error('O diretório de dados da aplicação é obrigatório.');
  }

  return path.join(userDataPath, DATABASE_DIRECTORY, DATABASE_FILE);
}

export function toSqliteUrl(databasePath: string): string {
  return `file:${databasePath.replaceAll('\\', '/')}`;
}
