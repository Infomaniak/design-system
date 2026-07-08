import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { asyncOptionalCascade } from '../../../../../scripts/helpers/misc/async/async-optional-cascade.ts';
import { runScript } from '../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvPublishConfig } from '../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { publishAndroidTokens } from './src/android/publish-android-tokens.ts';
import { publishIosTokens } from './src/ios/publish-ios-tokens.ts';
import { publishWebTokens } from './src/web/publish-web-tokens.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

await runScript('publish-tokens', async (logger: Logger): Promise<void> => {
  const publishConfig: PublishConfig = getEnvPublishConfig();

  await asyncOptionalCascade([
    (): Promise<void> =>
      publishWebTokens({
        ...publishConfig,
        outputDirectory: OUTPUT_DIR,
        logger,
      }),
    (): Promise<void> =>
      publishIosTokens({
        ...publishConfig,
        rootDirectory: ROOT_DIR,
        outputDirectory: OUTPUT_DIR,
        logger,
      }),
    (): Promise<void> =>
      publishAndroidTokens({
        ...publishConfig,
        rootDirectory: ROOT_DIR,
        outputDirectory: OUTPUT_DIR,
        logger,
      }),
  ]);
});
