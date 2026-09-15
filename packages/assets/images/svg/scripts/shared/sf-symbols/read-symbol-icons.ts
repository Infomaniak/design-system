import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { ICON_NAME_PATTERN } from '../icons/icon-name.ts';
import type { SvgOutlinePath, WindingRule } from '../icons/outline-path.ts';
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
const OUTLINED_SVG_PATH_ELEMENT_PATTERN: RegExp = /<path\b[^>]*>/g;
const SVG_ATTRIBUTE_PATTERN: RegExp = /([^\s=/]+)="([^"]*)"/g;

/*
 * Parses an outline SVG into its paths. Outline files are monochrome silhouettes whose paths are
 * self-contained (`<path d="..."/>`), so a light regex-based parsing is enough. The files are
 * optimized with SVGO: attributes may appear in any order and `fill="black"` is stripped (it is
 * the SVG default anyway). Only the geometry (`d`) and the winding rule (`fill-rule`) are read.
 * Inputs that would be silently mis-rendered as filled silhouettes are rejected.
 */
function parseOutlinedSvg(content: string, fileName: string): readonly SvgOutlinePath[] {
  if (!content.includes(OUTLINED_SVG_VIEW_BOX)) {
    throw new Error(
      `Unexpected viewBox in outline file ${JSON.stringify(fileName)}, expected ${JSON.stringify(OUTLINED_SVG_VIEW_BOX)}.`,
    );
  }

  /*
   * A `fill-rule` outside a `<path>` element (e.g. hoisted to a `<g>` by an SVGO group
   * optimization) would be silently ignored and flip winding rules to nonzero.
   */
  const contentWithoutPathElements: string = content.replace(OUTLINED_SVG_PATH_ELEMENT_PATTERN, '');
  if (contentWithoutPathElements.includes('fill-rule=')) {
    throw new Error(
      `Unexpected fill rule outside a path element in outline file ${JSON.stringify(fileName)}: only per-path fill rules are supported.`,
    );
  }

  const pathElements: readonly string[] = content.match(OUTLINED_SVG_PATH_ELEMENT_PATTERN) ?? [];
  const outlinedPaths: readonly SvgOutlinePath[] = pathElements
    .map((pathElement: string): SvgOutlinePath | null => parsePathElement(pathElement, fileName))
    .filter((path: SvgOutlinePath | null): path is SvgOutlinePath => path !== null);

  const pathElementCount: number = pathElements.length;
  if (outlinedPaths.length === 0 || pathElementCount !== outlinedPaths.length) {
    throw new Error(
      `Unexpected path elements in outline file ${JSON.stringify(fileName)}: parsed ${String(outlinedPaths.length)} of ${String(pathElementCount)}.`,
    );
  }

  return outlinedPaths;
}

/*
 * Parses a `<path>` element into an outline path, or returns null when it has no usable `d`
 * attribute (reported by the caller as an unparsed path element). An absent `fill-rule`
 * attribute defaults to "nonzero". Stroked or unfilled paths are rejected: their geometry
 * (centerlines, holes) would be silently rendered as filled silhouettes.
 */
function parsePathElement(pathElement: string, fileName: string): SvgOutlinePath | null {
  const attributes: ReadonlyMap<string, string> = new Map(
    [...pathElement.matchAll(SVG_ATTRIBUTE_PATTERN)].map(
      (match: RegExpMatchArray): [string, string] => [match[1]!, match[2]!],
    ),
  );

  const d: string | undefined = attributes.get('d');
  if (d === undefined || d === '') {
    return null;
  }

  if (attributes.get('fill') === 'none') {
    throw new Error(
      `Unexpected fill "none" in outline file ${JSON.stringify(fileName)}: outline paths must be filled silhouettes.`,
    );
  }

  if (attributes.has('stroke')) {
    throw new Error(
      `Unexpected stroke in outline file ${JSON.stringify(fileName)}: outline paths must be filled silhouettes.`,
    );
  }

  const fillRule: string | undefined = attributes.get('fill-rule');
  const windingRule: WindingRule = fillRule?.toLowerCase() === 'evenodd' ? 'EVENODD' : 'NONZERO';

  return { d, windingRule };
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
