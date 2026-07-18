export class DailyClosingDateConflictError extends Error {
  constructor() {
    super('Já existe um fechamento registrado para esta data.');
    this.name = 'DailyClosingDateConflictError';
  }
}

export class DailyClosingPersistenceError extends Error {
  constructor() {
    super('Não foi possível acessar os fechamentos salvos.');
    this.name = 'DailyClosingPersistenceError';
  }
}
