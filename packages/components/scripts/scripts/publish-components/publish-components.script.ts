import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { publishNpmPackageDirectory } from '../../../../../scripts/helpers/npm/publish-npm-package-directory/publish-npm-package-directory.ts';
import { getEnvPublishConfig } from '../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { publishModeToNpmTag } from '../../../../../scripts/helpers/publish/publish-mode/publish-mode-to-npm-tag.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

await runScript('publish-components', async (logger: Logger): Promise<void> => {
  const { mode }: PublishConfig = getEnvPublishConfig();

  await publishNpmPackageDirectory({
    packageDirectory: OUTPUT_DIR,
    tag: publishModeToNpmTag(mode),
    logger,
  });
});
