import { cleanupSVG, runSVGO, SVG } from '@iconify/tools';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readTextFile } from '../../../../../../../scripts/helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { applyAndroidOpticalSize } from './apply-android-optical-size.ts';

const SVG_FILE_EXTENSION = '.svg';
const MASK_SVG_FILE_SUFFIX = '.mask.svg';

export interface OptimizeAndroidSvgsOptions {
  /** Directory of the stroked Figma icons (`<name>.svg`). */
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
  /** Rendered icon size in dp, used to apply the optical stroke width. */
  readonly iconSize: number;
}

/**
 * Optimizes every stroked icon of the source directory with SVGO, applies the optical stroke width
 * of the icon size, and writes the result into the output directory, keeping the file names.
 *
 * @returns the sorted list of optimized file names.
 */
export async function optimizeAndroidSvgs({
  sourceDirectory,
  outputDirectory,
  iconSize,
}: OptimizeAndroidSvgsOptions): Promise<readonly string[]> {
  const fileNames: readonly string[] = await listStrokedIconFileNames(sourceDirectory);

  if (fileNames.length === 0) {
    throw new Error(`No stroked icons found in ${JSON.stringify(sourceDirectory)}.`);
  }

  await Promise.all(
    fileNames.map(async (fileName: string): Promise<void> => {
      const content: string = await readTextFile(join(sourceDirectory, fileName));
      await writeTextFileSafe(
        join(outputDirectory, fileName),
        optimizeAndroidSvg(content, iconSize),
      );
    }),
  );

  return fileNames;
}

/** Cleans up, optimizes with SVGO, then applies the optical stroke width of the icon size. */
export function optimizeAndroidSvg(content: string, iconSize: number): string {
  const svg: SVG = new SVG(content);

  cleanupSVG(svg);
  runSVGO(svg);
  applyAndroidOpticalSize(svg, iconSize);

  return svg.toString();
}

/** Lists the `<name>.svg` files, skipping the `<name>.mask.svg` variants derived from them. */
async function listStrokedIconFileNames(directory: string): Promise<readonly string[]> {
  return (await readdir(directory))
    .filter((fileName: string): boolean => isStrokedIconFileName(fileName))
    .sort();
}

function isStrokedIconFileName(fileName: string): boolean {
  return fileName.endsWith(SVG_FILE_EXTENSION) && !fileName.endsWith(MASK_SVG_FILE_SUFFIX);
}
