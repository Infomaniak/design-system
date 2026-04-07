import { join } from 'node:path';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { publishNpmPackageDirectory } from '../../../../../../../scripts/helpers/npm/publish-npm-package-directory/publish-npm-package-directory.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { publishModeToNpmTag } from '../../../../../../../scripts/helpers/publish/publish-mode/publish-mode-to-npm-tag.ts';

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
      tag: publishModeToNpmTag(mode),
      logger,
    });
  });
}
