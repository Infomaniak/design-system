import { join } from 'node:path';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import {
  publishNpmPackageDirectory,
  type PublishNpmPackageDirectoryResult,
} from '../../../../../../scripts/helpers/npm/publish-package-directory.ts';
export {
  buildNpmPublishArgs,
  resolvePublishVersion,
  rewriteInternalDependencyVersions,
} from '../../../../../../scripts/helpers/npm/publish-package-directory.ts';

export interface PublishTokensOptions {
  readonly outputDirectory: string;
  readonly tag?: string;
  readonly publishTimestamp?: number;
  readonly versionOverride?: string;
  readonly internalDependencyVersionOverrides?: Readonly<Record<string, string>>;
  readonly logger: Logger;
}

export interface PublishTokensResult {
  readonly npm: {
    readonly version: string;
  };
}

export interface PublishTokensNpmResult {
  readonly version: string;
}

export function publishTokens({
  outputDirectory,
  tag,
  publishTimestamp = Date.now(),
  versionOverride,
  internalDependencyVersionOverrides = {},
  logger,
}: PublishTokensOptions): Promise<PublishTokensResult> {
  const publishTag: string = tag === undefined || tag === '' ? 'latest' : tag;

  return logger.asyncTask(
    `publish-tokens (${publishTag})`,
    async (logger: Logger): Promise<PublishTokensResult> => {
      const npmResult: PublishNpmPackageDirectoryResult = await publishNpmPackageDirectory({
        packageDirectory: join(outputDirectory, 'web'),
        tag,
        publishTimestamp,
        versionOverride,
        internalDependencyVersionOverrides,
        logger,
      });

      return {
        npm: {
          version: npmResult.version,
        },
      };
    },
  );
}
