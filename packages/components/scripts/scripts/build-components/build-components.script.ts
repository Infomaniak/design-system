import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildConfig } from '../../../../../scripts/helpers/build/build-config/build-config.ts';
import { getEnvBuildConfig } from '../../../../../scripts/helpers/build/build-config/env/get-env-build-config.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../scripts/helpers/misc/exec-command.ts';
import { runScript } from '../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { generateWorkspaceNpmPackage } from '../../../../../scripts/helpers/npm/generate-workspace-npm-package/generate-workspace-npm-package.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const WORKSPACE_ROOT_DIR: string = join(ROOT_DIR, '../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

await runScript('build-components', async (logger: Logger): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  const buildConfig: BuildConfig = getEnvBuildConfig();

  await execCommandInherit(logger, 'yarn', ['run', 'build:manual']);

  // Copy custom-elements.json into dist so it's included in the published package
  await cp(join(ROOT_DIR, 'custom-elements.json'), join(OUTPUT_DIR, 'custom-elements.json'), {
    force: true,
  });

  // Ensure the triple-slash reference is present in dist public-api declaration so consumers
  // automatically load JSX types when importing the package.
  const distPublicApiDts = join(OUTPUT_DIR, 'public-api.d.ts');
  const publicApiContent = await readFile(distPublicApiDts, 'utf-8');
  const referenceDirective = '/// <reference path="./generated-jsx-types.d.ts" />';
  if (!publicApiContent.includes(referenceDirective)) {
    const augmentedContent = `${referenceDirective}\n${publicApiContent}`;
    await writeFile(distPublicApiDts, augmentedContent);
  }

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
