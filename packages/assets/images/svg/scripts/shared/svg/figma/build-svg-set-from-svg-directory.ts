import {
  cleanupSVG,
  type IconSet,
  importDirectory,
  isEmptyColor,
  parseColors,
  runSVGO,
  SVG,
} from '@iconify/tools';
import type { ColorAttributes } from '@iconify/tools/lib/colors/attribs';
import type { IconifyJSON } from '@iconify/types';
import type { Color } from '@iconify/utils/lib/colors/types';
import { glob, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { readJsonFile } from '../../../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import type { FigmaSvgMetadata } from './figma-svg-metadata.ts';

export type SVGOOptions = Parameters<typeof runSVGO>[1];

export interface BuildSvgSetFromSvgDirectoryOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
  readonly prefix: string;
  readonly logger: Logger;
  readonly cleanup?: boolean; // (default: true)
  readonly monotone?: boolean; // (default: true)
  readonly optimize?: boolean | SVGOOptions; // (default: true)
  readonly compareWithExistingVersion?: boolean; // (default: true)
}

/**
 * Builds an icon set for `@iconify` from a directory of SVG files.
 * The method processes, optimizes, and categorizes the SVG files, then exports them as a single JSON file.
 */
export async function buildSvgSetFromSvgDirectory({
  sourceDirectory,
  outputDirectory,
  prefix,
  logger,
  monotone = true,
  cleanup = true,
  optimize = true,
  compareWithExistingVersion = true,
}: BuildSvgSetFromSvgDirectoryOptions): Promise<void> {
  return logger.asyncTask('build-svgs-set', async (logger: Logger): Promise<void> => {
    const iconSet: IconSet = await importDirectory(sourceDirectory, {
      prefix,
    });

    // SVGs
    await iconSet.forEach((name: string, type: 'icon' | 'alias' | 'variation'): void => {
      if (type == 'icon') {
        const svg: SVG | null = iconSet.toSVG(name);

        if (svg === null) {
          iconSet.remove(name);
        } else {
          try {
            // clean the svg
            if (cleanup) {
              cleanupSVG(svg);
            }

            // only for monotone colors
            if (monotone) {
              parseColors(svg, {
                defaultColor: 'currentColor',
                callback: (
                  _attr: ColorAttributes,
                  colorStr: string,
                  color: Color | null,
                ): string => {
                  return color === null || isEmptyColor(color) ? colorStr : 'currentColor';
                },
              });
            }

            // optimize
            if (optimize) {
              runSVGO(svg, typeof optimize === 'boolean' ? undefined : optimize);
            }

            // update icon
            iconSet.fromSVG(name, svg);
          } catch (err) {
            logger.error(`Error parsing ${JSON.stringify(name)}:`, err);
            iconSet.remove(name);
            return;
          }
        }
      }
    });

    // CATEGORIES
    for (const iconName of iconSet.list(['icon'])) {
      iconSet.toggleCategory(iconName, '@all', true);
    }

    for await (const entry of glob(`${sourceDirectory}/*.metadata.json`)) {
      const iconName: string = basename(entry, '.metadata.json');
      const { tags, projects }: FigmaSvgMetadata = JSON.parse(
        await readFile(entry, {
          encoding: 'utf8',
        }),
      );

      for (const tag of tags) {
        iconSet.toggleCategory(iconName, `#${tag}`, true);
      }

      for (const project of projects) {
        iconSet.toggleCategory(iconName, `@${project}`, true);
      }
    }

    // INFO
    iconSet.info = {
      name: `Infomaniak "${iconSet.prefix}" icons`,
      author: {
        name: 'Infomaniak',
      },
      license: {
        title: 'MIT',
      },
    };

    // EXPORT
    const jsonIconSet: IconifyJSON = iconSet.export();
    const jsonIconSetString: string = JSON.stringify(jsonIconSet, null, 2);
    const jsonIconSetOutputDirectoryPath: string = join(outputDirectory, `${iconSet.prefix}.json`);

    if (compareWithExistingVersion) {
      try {
        const currentJsonIconSet: IconifyJSON = await readJsonFile(jsonIconSetOutputDirectoryPath);
        currentJsonIconSet.lastModified = jsonIconSet.lastModified;
        if (JSON.stringify(currentJsonIconSet, null, 2) === jsonIconSetString) {
          logger.info('Icon set is identical.');
          return;
        }
      } catch {}
    }

    await writeJsonFileSafe(jsonIconSetOutputDirectoryPath, jsonIconSet, 'utf8');
  });
}
