import { mkdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../scripts/helpers/misc/exec-command.ts';
import {
  ANDROID_ICON_PACK_NAME,
  ANDROID_IMAGE_VECTORS_PACKAGE_NAME,
} from './android-icons-config.ts';

/** Valkyrie CLI release used to convert SVGs into Compose `ImageVector`s. Requires Java 21+. */
export const VALKYRIE_CLI_VERSION = '1.2.1';

const VALKYRIE_CLI_ARCHIVE_URL = `https://github.com/ComposeGears/Valkyrie/releases/download/cli-${VALKYRIE_CLI_VERSION}/valkyrie-cli-${VALKYRIE_CLI_VERSION}.zip`;
const VALKYRIE_CLI_ARCHIVE_FILE_NAME = 'valkyrie-cli.zip';
const VALKYRIE_CLI_JAR_RELATIVE_PATH = `lib/valkyrie-${VALKYRIE_CLI_VERSION}-all.jar`;

export interface InstallValkyrieCliOptions {
  /** Directory where the CLI archive is extracted. Reused as a cache between runs. */
  readonly installDirectory: string;
  readonly logger: Logger;
}

/**
 * Downloads and extracts the Valkyrie CLI, unless this version is already installed.
 *
 * @returns the path of the Valkyrie CLI jar.
 */
export async function installValkyrieCli({
  installDirectory,
  logger,
}: InstallValkyrieCliOptions): Promise<string> {
  const jarPath: string = join(installDirectory, VALKYRIE_CLI_JAR_RELATIVE_PATH);

  if (await isExistingFile(jarPath)) {
    logger.debug(`Valkyrie CLI ${VALKYRIE_CLI_VERSION} already installed.`);
    return jarPath;
  }

  const archivePath: string = join(installDirectory, VALKYRIE_CLI_ARCHIVE_FILE_NAME);

  await mkdir(installDirectory, { recursive: true });
  await execCommandInherit(logger, 'curl', ['-sSL', '-o', archivePath, VALKYRIE_CLI_ARCHIVE_URL]);
  await execCommandInherit(logger, 'unzip', ['-oq', archivePath, '-d', installDirectory]);
  await rm(archivePath, { force: true });

  return jarPath;
}

export interface ConvertSvgsToImageVectorsOptions {
  readonly valkyrieCliJarPath: string;
  readonly svgsDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

/**
 * Converts every SVG of the directory into a `EsdsIcons.<IconName>` Compose `ImageVector`
 * Kotlin file (one file per icon, named `<IconName>.kt`).
 */
export async function convertSvgsToImageVectors({
  valkyrieCliJarPath,
  svgsDirectory,
  outputDirectory,
  logger,
}: ConvertSvgsToImageVectorsOptions): Promise<void> {
  await execCommandInherit(logger, 'java', [
    '-jar',
    valkyrieCliJarPath,
    'svgxml2imagevector',
    `--input-path=${svgsDirectory}`,
    `--output-path=${outputDirectory}`,
    `--package-name=${ANDROID_IMAGE_VECTORS_PACKAGE_NAME}`,
    `--iconpack-name=${ANDROID_ICON_PACK_NAME}`,
    '--explicit-mode=true',
    '--trailing-comma=true',
  ]);
}

async function isExistingFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}
