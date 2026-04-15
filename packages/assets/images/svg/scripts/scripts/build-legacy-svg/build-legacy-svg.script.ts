import { opendir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inc } from 'semver';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { addGitAllFiles } from '../../../../../../../scripts/helpers/git/add-git-all-files.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { buildSvgSetFromSvgDirectory } from '../../shared/svg/figma/build-svg-set-from-svg-directory.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const ASSETS_DIR: string = join(ROOT_DIR, 'assets');
const LEGACY_ASSETS_DIR: string = join(ASSETS_DIR, 'svg/monotone/legacy');

await runScript('build-legacy-svgs', async (logger: Logger): Promise<void> => {
  const packageJson: PackageJson = await readPackageJsonFile(join(ROOT_DIR, 'package.json'));

  const importVersion: string | null = inc(packageJson.version, 'patch');

  if (importVersion === null) {
    throw new Error('Failed to increment the version.');
  }

  let hasNewAssets: boolean = false;

  for await (const entry of await opendir(LEGACY_ASSETS_DIR)) {
    hasNewAssets =
      (await buildSvgSetFromSvgDirectory({
        version: importVersion,
        prefix: `esds-legacy-${entry.name}`,
        sourceDirectory: join(LEGACY_ASSETS_DIR, entry.name),
        outputDirectory: join(ASSETS_DIR, 'server'),
        monotone: true,
        logger,
      })) || hasNewAssets;
  }

  if (!hasNewAssets) {
    throw new Error('No new assets have been build.');
  }

  // update package.json version
  await writeJsonFileSafe(join(ROOT_DIR, 'package.json'), {
    ...packageJson,
    version: importVersion,
  });

  await addGitAllFiles({ logger });
});
