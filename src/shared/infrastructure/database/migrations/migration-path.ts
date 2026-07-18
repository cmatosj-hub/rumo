import path from 'node:path';

export interface MigrationPathContext {
  readonly isPackaged: boolean;
  readonly projectRoot: string;
  readonly resourcesPath: string;
}

export function resolveMigrationsDirectory(
  context: MigrationPathContext,
): string {
  return context.isPackaged
    ? path.join(context.resourcesPath, 'migrations')
    : path.join(context.projectRoot, 'prisma', 'migrations');
}
