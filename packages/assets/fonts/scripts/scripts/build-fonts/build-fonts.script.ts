import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildConfig } from '../../../../../../scripts/helpers/build/build-config/build-config.ts';
import { getEnvBuildConfig } from '../../../../../../scripts/helpers/build/build-config/env/get-env-build-config.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { buildFonts } from './src/build-fonts.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const SOURCE_DIR: string = join(ROOT_DIR, 'fonts');

// const SERVER_URL: string = 'https://fonts.infomaniak.com';
const SERVER_URL: string = 'https://fonts.storage.infomaniak.com';

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

await runScript('build-fonts', async (logger: Logger): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  const buildConfig: BuildConfig = getEnvBuildConfig();

  await buildFonts({
    logger,
    sourceDirectory: SOURCE_DIR,
    outputDirectory: OUTPUT_DIR,
    serverURL: new URL(
      `./${buildConfigToFontPublishDirectory(buildConfig)}/`,
      SERVER_URL,
    ).toString(),
  });

  // TODO: should we publish as npm package ? Or maybe host on S3 ?
});

/*--*/

export function buildConfigToFontPublishDirectory(buildConfig: BuildConfig): string {
  switch (buildConfig.mode) {
    case 'dev':
    case 'rc':
      return 'dev';
    case 'prod':
      return 'latest';
  }
}
