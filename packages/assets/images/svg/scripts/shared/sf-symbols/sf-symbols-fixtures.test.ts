import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import {
  computePathDataBoundingBox,
  computePathsBoundingBox,
  type PathBoundingBox,
} from '../icons/bake-transform-into-path.ts';
import { getSymbolCanvasScale } from './build-symbol-svg.ts';
import { generateSfSymbols } from './generate-sf-symbols.ts';
import { readSymbolTemplate, type SymbolTemplate } from './parse-symbol-template.ts';
import { OUTLINE_FILE_SUFFIX } from './read-symbol-icons.ts';
import { SYMBOL_CANVAS_SIZE, SYMBOLS_XCASSETS_DIRECTORY_NAME } from './sf-symbols-config.ts';

const logger = Logger.never();
const FIXTURES_DIRECTORY: string = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
/*
 * Golden outlines extracted from the real Figma icons (`esds/icon/<name>`, geometry=paths).
 * Snapshots: they do not follow future Figma redesigns (that is their role: stability).
 */
const FIXTURE_ICON_NAMES: readonly string[] = ['circle-check-filled', 'magnifying-glass', 'check'];
const FIXTURE_PATH_COUNTS: Readonly<Record<string, number>> = {
  'circle-check-filled': 1,
  'magnifying-glass': 1,
  check: 1,
};
const WIREFRAME_PATH_PATTERN = /<path class="SFSymbolsPreviewWireframe" d="([^"]+)"/g;

describe('sf-symbols fixtures', () => {
  let outputDirectory: string;
  let template: SymbolTemplate;

  beforeEach(async () => {
    outputDirectory = await mkdtemp(join(tmpdir(), 'sf-symbols-fixtures-'));
    template = await readSymbolTemplate();
    await generateSfSymbols({ outputDirectory, outlinesDirectory: FIXTURES_DIRECTORY, logger });
  });

  afterEach(async () => {
    await rm(outputDirectory, { force: true, recursive: true });
  });

  const readSymbolSvg = async (iconName: string): Promise<string> => {
    return readFile(
      join(
        outputDirectory,
        SYMBOLS_XCASSETS_DIRECTORY_NAME,
        `${iconName}.symbolset`,
        `${iconName}.symbol.svg`,
      ),
      'utf8',
    );
  };

  const readFixtureOutlineBoundingBox = async (iconName: string): Promise<PathBoundingBox> => {
    const content: string = await readFile(
      join(FIXTURES_DIRECTORY, `${iconName}${OUTLINE_FILE_SUFFIX}`),
      'utf8',
    );
    const pathDataList: readonly string[] = [...content.matchAll(/ d="([^"]+)"/g)].map(
      (match: RegExpMatchArray): string => match[1]!,
    );
    return computePathsBoundingBox(pathDataList);
  };

  test('builds every fixture icon into a complete symbolset', async () => {
    const xcassetsDirectory: string = join(outputDirectory, SYMBOLS_XCASSETS_DIRECTORY_NAME);

    expect((await readdir(xcassetsDirectory)).sort()).toEqual(
      [
        'Contents.json',
        ...FIXTURE_ICON_NAMES.map((name: string): string => `${name}.symbolset`),
      ].sort(),
    );
    expect(JSON.parse(await readFile(join(xcassetsDirectory, 'Contents.json'), 'utf8'))).toEqual({
      info: { author: 'xcode', version: 1 },
    });

    for (const iconName of FIXTURE_ICON_NAMES) {
      const symbolsetDirectory: string = join(xcassetsDirectory, `${iconName}.symbolset`);

      expect(await readdir(symbolsetDirectory)).toEqual([
        'Contents.json',
        `${iconName}.symbol.svg`,
      ]);
      expect(JSON.parse(await readFile(join(symbolsetDirectory, 'Contents.json'), 'utf8'))).toEqual(
        {
          info: { author: 'xcode', version: 1 },
          symbols: [{ filename: `${iconName}.symbol.svg`, idiom: 'universal' }],
        },
      );
    }
  });

  test('bakes the fixture geometry into every template weight variant', async () => {
    const cellHeight: number = template.baselineY - template.caplineY;

    for (const iconName of FIXTURE_ICON_NAMES) {
      const content: string = await readSymbolSvg(iconName);
      expect(content).toContain(`Generated from ${iconName}</text>`);

      const sourceBoundingBox: PathBoundingBox = await readFixtureOutlineBoundingBox(iconName);

      for (const variant of template.variants) {
        const canvasScale: number = getSymbolCanvasScale({ variant, template });
        const groupOpenTag: string =
          new RegExp(`<g id="${variant.id}"[^>]*>`).exec(content)?.[0] ?? '';
        const templateGroupOpenTag: string =
          new RegExp(`<g id="${variant.id}"[^>]*>`).exec(template.content)?.[0] ?? '';
        expect(groupOpenTag).not.toBe('');
        expect(groupOpenTag).toBe(templateGroupOpenTag);

        const groupBody: string =
          new RegExp(`<g id="${variant.id}"[^>]*>([\\s\\S]*?)</g>`).exec(content)?.[1] ?? '';
        const fittedPaths: readonly string[] = [...groupBody.matchAll(WIREFRAME_PATH_PATTERN)].map(
          (match: RegExpMatchArray): string => match[1]!,
        );
        expect(fittedPaths).toHaveLength(FIXTURE_PATH_COUNTS[iconName]!);

        const boundingBox = computePathDataBoundingBox(fittedPaths.join(' '));

        // the 24×24 design canvas is mapped onto the cell: designed insets and proportions
        // between icons are preserved
        expect(boundingBox.minX).toBeCloseTo(
          variant.cellWidth / 2 - canvasScale * (SYMBOL_CANVAS_SIZE / 2 - sourceBoundingBox.minX),
          2,
        );
        expect(boundingBox.maxX).toBeCloseTo(
          variant.cellWidth / 2 + canvasScale * (sourceBoundingBox.maxX - SYMBOL_CANVAS_SIZE / 2),
          2,
        );
        expect(boundingBox.minY).toBeCloseTo(
          -cellHeight / 2 - canvasScale * (SYMBOL_CANVAS_SIZE / 2 - sourceBoundingBox.minY),
          2,
        );
        expect(boundingBox.maxY).toBeCloseTo(
          -cellHeight / 2 + canvasScale * (sourceBoundingBox.maxY - SYMBOL_CANVAS_SIZE / 2),
          2,
        );
        // fully inside the cell
        expect(boundingBox.minY).toBeGreaterThanOrEqual(-cellHeight - 0.01);
        expect(boundingBox.maxY).toBeLessThanOrEqual(0.01);
        expect(boundingBox.minX).toBeGreaterThanOrEqual(-0.01);
        expect(boundingBox.maxX).toBeLessThanOrEqual(variant.cellWidth + 0.01);
      }
    }
  });

  test('preserves the (non-zero) winding rule of each fixture', async () => {
    for (const iconName of FIXTURE_ICON_NAMES) {
      const content: string = await readSymbolSvg(iconName);
      expect(content).not.toContain('fill-rule');
      expect(content.match(WIREFRAME_PATH_PATTERN)).toHaveLength(
        FIXTURE_PATH_COUNTS[iconName]! * template.variants.length,
      );
    }
  });
});
