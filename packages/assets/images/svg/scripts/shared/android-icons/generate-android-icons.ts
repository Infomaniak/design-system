import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { addImageVectorPreviewsToDirectory } from './add-image-vector-preview.ts';
import {
  ANDROID_ICON_SIZES,
  ANDROID_ICONS_KOTLIN_DIRECTORY_NAME,
  ANDROID_ICONS_SVGS_DIRECTORY_NAME,
  type AndroidIconSize,
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
 * Wipes the output directory then generates the Android icons of every t-shirt size:
 * 1. optimizes the stroked SVGs with SVGO and applies the optical stroke width into `svgs/<size>/`,
 * 2. converts them into `EsdsIcons.<Size>` Compose `ImageVector`s with Valkyrie into `kt/<size>/`,
 * 3. adds a preview to every generated Kotlin file.
 *
 * @returns the sorted list of generated icons, as `<Size>.<IconName>`.
 */
export async function generateAndroidIcons({
  sourceDirectory,
  outputDirectory,
  valkyrieCliInstallDirectory,
  logger,
}: GenerateAndroidIconsOptions): Promise<readonly string[]> {
  await rm(outputDirectory, { force: true, recursive: true });

  const valkyrieCliJarPath: string = await installValkyrieCli({
    installDirectory: valkyrieCliInstallDirectory,
    logger,
  });

  const iconNamesBySize: readonly (readonly string[])[] = await Promise.all(
    ANDROID_ICON_SIZES.map((iconSize: AndroidIconSize): Promise<readonly string[]> => {
      return generateAndroidIconsOfSize({
        sourceDirectory,
        outputDirectory,
        valkyrieCliJarPath,
        iconSize,
        logger,
      });
    }),
  );

  return iconNamesBySize.flat().sort();
}

interface GenerateAndroidIconsOfSizeOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
  readonly valkyrieCliJarPath: string;
  readonly iconSize: AndroidIconSize;
  readonly logger: Logger;
}

async function generateAndroidIconsOfSize({
  sourceDirectory,
  outputDirectory,
  valkyrieCliJarPath,
  iconSize,
  logger,
}: GenerateAndroidIconsOfSizeOptions): Promise<readonly string[]> {
  const sizeDirectoryName: string = getAndroidIconSizeDirectoryName(iconSize);
  const kotlinDirectory: string = join(outputDirectory, ANDROID_ICONS_KOTLIN_DIRECTORY_NAME);
  const svgsDirectory: string = join(
    outputDirectory,
    ANDROID_ICONS_SVGS_DIRECTORY_NAME,
    sizeDirectoryName,
  );

  await optimizeAndroidSvgs({
    sourceDirectory,
    outputDirectory: svgsDirectory,
    iconSize: iconSize.size,
  });

  await convertSvgsToImageVectors({
    valkyrieCliJarPath,
    svgsDirectory,
    outputDirectory: kotlinDirectory,
    nestedPackName: iconSize.name,
    logger,
  });

  const iconNames: readonly string[] = await addImageVectorPreviewsToDirectory(
    join(kotlinDirectory, sizeDirectoryName),
    iconSize.name,
  );

  return iconNames.map((iconName: string): string => `${iconSize.name}.${iconName}`);
}

/** Valkyrie writes each nested icon pack into a directory named after it, in lower case. */
function getAndroidIconSizeDirectoryName({ name }: AndroidIconSize): string {
  return name.toLowerCase();
}
