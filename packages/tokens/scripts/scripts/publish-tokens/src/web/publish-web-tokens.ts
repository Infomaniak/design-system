import { join } from 'node:path';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { block } from '../../../../../../../scripts/helpers/misc/block.ts';
import { publishNpmPackageDirectory } from '../../../../../../../scripts/helpers/npm/publish-npm-package-directory/publish-npm-package-directory.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';

export interface PublishWebTokensOptions extends PublishConfig {
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function publishWebTokens({
  outputDirectory,
  logger,
  // shared publish options
  mode,
}: PublishWebTokensOptions): Promise<void> {
  return logger.asyncTask('npm', async (): Promise<void> => {
    await publishNpmPackageDirectory({
      packageDirectory: join(outputDirectory, 'web'),
      tag: block((): string => {
        switch (mode) {
          case 'dev':
            return 'dev';
          case 'rc':
            return 'rc';
          case 'prod':
            return 'lastest';
          default:
            throw new Error(`Invalid mode: ${mode}`);
        }
      }),
      logger,
    });
  });
}
