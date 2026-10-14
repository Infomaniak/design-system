import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { addImageVectorPreviewsToDirectory } from './add-image-vector-preview.ts';
import {
  ANDROID_ICONS_KOTLIN_DIRECTORY_NAME,
  ANDROID_ICONS_SVGS_DIRECTORY_NAME,
} from './android-icons-config.ts';
import { optimizeAndroidSvgs } from './optimize-android-svgs.ts';
import { convertSvgsToImageVectors, installValkyrieCli } from './valkyrie-cli.ts';

export interface GenerateAndroidIconsOptions {
  /** Directory of the stroked Figma icons. */
  readonly sourceDirectory: string;
  /** Directory wiped and filled with the `svgs/` and `kt/` sub-directories. */
  readonly outputDirectory: string;
  readonly valkyrieCliInstallDirectory: string;
  readonly logger: Logger;
}

/**
 * Wipes the output directory then generates the Android icons:
 * 1. optimizes the stroked SVGs with SVGO into `svgs/`,
 * 2. converts them into Compose `ImageVector`s with Valkyrie into `kt/`,
 * 3. adds a preview to every generated Kotlin file.
 *
 * @returns the sorted list of generated icon names.
 */
export async function generateAndroidIcons({
  sourceDirectory,
  outputDirectory,
  valkyrieCliInstallDirectory,
  logger,
}: GenerateAndroidIconsOptions): Promise<readonly string[]> {
  const svgsDirectory: string = join(outputDirectory, ANDROID_ICONS_SVGS_DIRECTORY_NAME);
  const kotlinDirectory: string = join(outputDirectory, ANDROID_ICONS_KOTLIN_DIRECTORY_NAME);

  await rm(outputDirectory, { force: true, recursive: true });

  await optimizeAndroidSvgs({ sourceDirectory, outputDirectory: svgsDirectory });

  await convertSvgsToImageVectors({
    valkyrieCliJarPath: await installValkyrieCli({
      installDirectory: valkyrieCliInstallDirectory,
      logger,
    }),
    svgsDirectory,
    outputDirectory: kotlinDirectory,
    logger,
  });

  return addImageVectorPreviewsToDirectory(kotlinDirectory);
}
