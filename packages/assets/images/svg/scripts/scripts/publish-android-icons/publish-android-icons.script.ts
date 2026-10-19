import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvPublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { ANDROID_ICONS_KOTLIN_DIRECTORY_NAME } from '../../shared/android-icons/android-icons-config.ts';
import { publishAndroidIcons } from './src/publish-android-icons.ts';

const SCRIPT_DIR: string = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT_DIR: string = join(SCRIPT_DIR, '../../..');
const OUTPUT_DIR: string = join(PACKAGE_ROOT_DIR, 'dist/android/icons');

await runScript('publish-android-icons', async (logger: Logger): Promise<void> => {
  const publishConfig: PublishConfig = getEnvPublishConfig();

  await publishAndroidIcons({
    ...publishConfig,
    packageRootDirectory: PACKAGE_ROOT_DIR,
    imageVectorsDirectory: join(OUTPUT_DIR, ANDROID_ICONS_KOTLIN_DIRECTORY_NAME),
    logger,
  });
});
