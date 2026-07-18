export type ApplicationInitializationStage =
  | 'waiting-for-electron-ready'
  | 'configuring-secure-session'
  | 'loading-database-infrastructure'
  | 'resolving-database-paths'
  | 'applying-migrations'
  | 'connecting-database'
  | 'creating-main-window'
  | 'registering-ipc';

export class ApplicationInitializationError extends Error {
  readonly stage: ApplicationInitializationStage;

  constructor(stage: ApplicationInitializationStage, cause: unknown) {
    super(`Application initialization failed during ${stage}.`, { cause });
    this.name = 'ApplicationInitializationError';
    this.stage = stage;
  }
}
