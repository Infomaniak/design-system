import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildConfig } from '../../../../../../../../scripts/helpers/build/build-config/build-config.ts';
import { getEnvBuildConfig } from '../../../../../../../../scripts/helpers/build/build-config/env/get-env-build-config.ts';
import { loadOptionallyEnvFile } from '../../../../../../../../scripts/helpers/env/env-file/load-optionally-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../../scripts/helpers/misc/exec-command.ts';
import { generateWorkspaceNpmPackage } from '../../../../../../../../scripts/helpers/npm/generate-workspace-npm-package/generate-workspace-npm-package.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const WORKSPACE_ROOT_DIR: string = join(ROOT_DIR, '../../../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export function buildSvgComponentScript(): Promise<void> {
  return logger.asyncTask('build-svg-component.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    await rm(OUTPUT_DIR, { force: true, recursive: true });

    const buildConfig: BuildConfig = getEnvBuildConfig();

    await execCommandInherit(logger, 'yarn', ['run', 'build:manual']);

    await generateWorkspaceNpmPackage({
      ...buildConfig,
      packageDirectory: ROOT_DIR,
      workspaceRootDirectory: WORKSPACE_ROOT_DIR,
      outputDirectory: OUTPUT_DIR,
      logger,
      // Strip ./dist/ and /dist/ prefixes from paths since files are now in the dist/ directory
      stripDistPaths: {
        patterns: ['./dist/', '/dist/'],
      },
    });
  });
}

try {
  await buildSvgComponentScript();
} catch (error: unknown) {
  logger.fatal(error);
}
