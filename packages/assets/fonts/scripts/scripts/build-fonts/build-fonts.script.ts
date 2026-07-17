import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildConfig } from '../../../../../../scripts/helpers/build/build-config/build-config.ts';
import { getEnvBuildConfig } from '../../../../../../scripts/helpers/build/build-config/env/get-env-build-config.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { generateWorkspaceNpmPackage } from '../../../../../../scripts/helpers/npm/generate-workspace-npm-package/generate-workspace-npm-package.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const WORKSPACE_ROOT_DIR: string = join(ROOT_DIR, '../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

await runScript('build-fonts', async (logger: Logger): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  const buildConfig: BuildConfig = getEnvBuildConfig();

  // TODO: should we publish as npm package ? Or maybe host on S3 ?
  await generateWorkspaceNpmPackage({
    ...buildConfig,
    packageDirectory: ROOT_DIR,
    workspaceRootDirectory: WORKSPACE_ROOT_DIR,
    outputDirectory: OUTPUT_DIR,
    logger,
  });
});
