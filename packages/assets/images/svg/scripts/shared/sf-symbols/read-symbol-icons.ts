import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { ICON_NAME_PATTERN } from '../icons/icon-name.ts';
import type { SvgOutlinePath } from '../icons/outline-path.ts';
import type { SymbolIcon } from './build-symbols-xcassets.ts';

export interface ReadSymbolIconsOptions {
  readonly outlinesDirectory: string;
  /**
   * Directory containing the web `<name>.svg` icon files. When provided, icons without an outline
   * file (and outline files without an icon) are reported as warnings: the check is advisory and
   * never fails generation.
   */
  readonly webIconsDirectory?: string;
  readonly logger: Logger;
}

export async function readSymbolIcons({
  outlinesDirectory,
  webIconsDirectory,
  logger,
}: ReadSymbolIconsOptions): Promise<readonly SymbolIcon[]> {
  return logger.asyncTask(
    'read-symbol-icons',
    async (logger: Logger): Promise<readonly SymbolIcon[]> => {
      let directoryFileNames: readonly string[];
      try {
        directoryFileNames = await readdir(outlinesDirectory);
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          // "outlines" directory does not exist: assumes no icon
          return [];
        }
        throw error;
      }

      const fileNames: readonly string[] = directoryFileNames
        .filter((fileName: string): boolean => fileName.endsWith(OUTLINE_FILE_SUFFIX))
        .sort();

      if (fileNames.length === 0) {
        throw new Error(`No outline files found in ${JSON.stringify(outlinesDirectory)}.`);
      }

      const icons: SymbolIcon[] = [];

      for (const fileName of fileNames) {
        const name: string = basename(fileName, OUTLINE_FILE_SUFFIX);
        if (!ICON_NAME_PATTERN.test(name)) {
          throw new Error(`Invalid outline file name ${JSON.stringify(fileName)}.`);
        }

        const content: string = await readFile(join(outlinesDirectory, fileName), {
          encoding: 'utf8',
        });
        icons.push({ name, outlinedPaths: parseOutlinedSvg(content, fileName) });
      }

      if (webIconsDirectory !== undefined) {
        await warnOnIconOutlineMismatches({
          webIconsDirectory,
          outlineIconNames: new Set(icons.map(({ name }: SymbolIcon): string => name)),
          logger,
        });
      }

      logger.info(`Read ${String(icons.length)} outline icons.`);
      return icons;
    },
  );
}

export const OUTLINE_FILE_SUFFIX = '.outline.svg';
const WEB_ICON_FILE_SUFFIX = '.svg';
const EXCLUDED_WEB_ICON_FILE_SUFFIXES: readonly string[] = [OUTLINE_FILE_SUFFIX, '.mask.svg'];
const OUTLINED_SVG_VIEW_BOX = 'viewBox="0 0 24 24"';
const OUTLINED_SVG_PATH_PATTERN: RegExp =
  /<path d="([^"]+)" fill="black"( fill-rule="evenodd")?\/>/g;
const OUTLINED_SVG_PATH_ELEMENT_PATTERN: RegExp = /<path/g;

function parseOutlinedSvg(content: string, fileName: string): readonly SvgOutlinePath[] {
  if (!content.includes(OUTLINED_SVG_VIEW_BOX)) {
    throw new Error(
      `Unexpected viewBox in outline file ${JSON.stringify(fileName)}, expected ${JSON.stringify(OUTLINED_SVG_VIEW_BOX)}.`,
    );
  }

  const outlinedPaths: readonly SvgOutlinePath[] = [
    ...content.matchAll(OUTLINED_SVG_PATH_PATTERN),
  ].map((match: RegExpMatchArray): SvgOutlinePath => {
    return {
      d: match[1]!,
      windingRule: match[2] !== undefined ? 'EVENODD' : 'NONZERO',
    };
  });

  const pathElementCount: number = content.match(OUTLINED_SVG_PATH_ELEMENT_PATTERN)?.length ?? 0;
  if (outlinedPaths.length === 0 || pathElementCount !== outlinedPaths.length) {
    throw new Error(
      `Unexpected path elements in outline file ${JSON.stringify(fileName)}: parsed ${String(outlinedPaths.length)} of ${String(pathElementCount)}.`,
    );
  }

  return outlinedPaths;
}

async function warnOnIconOutlineMismatches({
  webIconsDirectory,
  outlineIconNames,
  logger,
}: {
  readonly webIconsDirectory: string;
  readonly outlineIconNames: ReadonlySet<string>;
  readonly logger: Logger;
}): Promise<void> {
  let directoryFileNames: readonly string[];
  try {
    directoryFileNames = await readdir(webIconsDirectory);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Web icons directory ${JSON.stringify(webIconsDirectory)} does not exist.`, {
        cause: error,
      });
    }
    throw error;
  }

  const webIconNames: ReadonlySet<string> = new Set(
    directoryFileNames
      .filter((fileName: string): boolean => {
        return (
          fileName.endsWith(WEB_ICON_FILE_SUFFIX) &&
          !EXCLUDED_WEB_ICON_FILE_SUFFIXES.some((suffix: string): boolean =>
            fileName.endsWith(suffix),
          )
        );
      })
      .map((fileName: string): string => basename(fileName, WEB_ICON_FILE_SUFFIX)),
  );

  const iconsWithoutOutline: readonly string[] = [...webIconNames]
    .filter((name: string): boolean => !outlineIconNames.has(name))
    .sort();
  if (iconsWithoutOutline.length > 0) {
    logger.warn(
      `${String(iconsWithoutOutline.length)} icon(s) have no outline file; no SF Symbol will be generated for them: ${iconsWithoutOutline
        .map((name: string): string => JSON.stringify(name))
        .join(', ')}.`,
    );
  }

  const outlinesWithoutIcon: readonly string[] = [...outlineIconNames]
    .filter((name: string): boolean => !webIconNames.has(name))
    .sort();
  if (outlinesWithoutIcon.length > 0) {
    logger.warn(
      `${String(outlinesWithoutIcon.length)} outline file(s) have no corresponding web SVG icon: ${outlinesWithoutIcon
        .map((name: string): string => JSON.stringify(name))
        .join(', ')}.`,
    );
  }
}
