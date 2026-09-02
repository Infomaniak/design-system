import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvPublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { publishSfSymbols } from './src/publish-sf-symbols.ts';

const SCRIPT_DIR: string = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT_DIR: string = join(SCRIPT_DIR, '../../..');
const FIGMA_ICONS_DIRECTORY: string = join(PACKAGE_ROOT_DIR, 'assets/svg/monotone/figma');
const OUTPUT_DIR: string = join(PACKAGE_ROOT_DIR, 'dist/sf-symbols');

await runScript('publish-sf-symbols', async (logger: Logger): Promise<void> => {
  const publishConfig: PublishConfig = getEnvPublishConfig();

  await publishSfSymbols({
    ...publishConfig,
    packageRootDirectory: PACKAGE_ROOT_DIR,
    outputDirectory: OUTPUT_DIR,
    outlinesDirectory: join(FIGMA_ICONS_DIRECTORY, 'outlines'),
    webIconsDirectory: FIGMA_ICONS_DIRECTORY,
    logger,
  });
});
