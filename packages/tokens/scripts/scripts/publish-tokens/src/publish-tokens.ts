import { join } from 'node:path';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { publishNpmPackageDirectory } from '../../../../../../scripts/helpers/npm/publish-npm-package-directory/publish-npm-package-directory.ts';

export interface PublishTokensOptions {
  readonly outputDirectory: string;
  readonly tag?: string;
  readonly publishTimestamp?: number;
  readonly versionOverride?: string;
  readonly internalDependencyVersionOverrides?: Readonly<Record<string, string>>;
  readonly logger: Logger;
}

export async function publishTokens({
  outputDirectory,
  tag,
  publishTimestamp = Date.now(),
  versionOverride,
  internalDependencyVersionOverrides = {},
  logger,
}: PublishTokensOptions): Promise<void> {
  await logger.asyncTask('publish:npm', async (): Promise<void> => {
    await publishNpmPackageDirectory({
      packageDirectory: join(outputDirectory, 'web'),
      tag,
      publishTimestamp,
      versionOverride,
      internalDependencyVersionOverrides,
      logger,
    });
  });
}
