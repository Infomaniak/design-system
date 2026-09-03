import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { computePathDataBoundingBox } from '../icons/bake-transform-into-path.ts';
import { generateSfSymbols } from './generate-sf-symbols.ts';
import { readSymbolTemplate, type SymbolTemplate } from './parse-symbol-template.ts';
import { SYMBOL_NAME_PREFIX, SYMBOLS_XCASSETS_DIRECTORY_NAME } from './sf-symbols-config.ts';

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
    const symbolName: string = `${SYMBOL_NAME_PREFIX}${iconName}`;
    return readFile(
      join(
        outputDirectory,
        SYMBOLS_XCASSETS_DIRECTORY_NAME,
        `${symbolName}.symbolset`,
        `${symbolName}.symbol.svg`,
      ),
      'utf8',
    );
  };

  test('builds every fixture icon into a complete symbolset', async () => {
    const xcassetsDirectory: string = join(outputDirectory, SYMBOLS_XCASSETS_DIRECTORY_NAME);

    expect((await readdir(xcassetsDirectory)).sort()).toEqual(
      [
        'Contents.json',
        ...FIXTURE_ICON_NAMES.map(
          (name: string): string => `${SYMBOL_NAME_PREFIX}${name}.symbolset`,
        ),
      ].sort(),
    );
    expect(JSON.parse(await readFile(join(xcassetsDirectory, 'Contents.json'), 'utf8'))).toEqual({
      info: { author: 'xcode', version: 1 },
    });

    for (const iconName of FIXTURE_ICON_NAMES) {
      const symbolName: string = `${SYMBOL_NAME_PREFIX}${iconName}`;
      const symbolsetDirectory: string = join(xcassetsDirectory, `${symbolName}.symbolset`);

      expect(await readdir(symbolsetDirectory)).toEqual([
        'Contents.json',
        `${symbolName}.symbol.svg`,
      ]);
      expect(JSON.parse(await readFile(join(symbolsetDirectory, 'Contents.json'), 'utf8'))).toEqual(
        {
          info: { author: 'xcode', version: 1 },
          symbols: [{ filename: `${symbolName}.symbol.svg`, idiom: 'universal' }],
        },
      );
    }
  });

  test('bakes the fixture geometry into every template weight variant', async () => {
    const cellHeight: number = template.baselineY - template.caplineY;

    for (const iconName of FIXTURE_ICON_NAMES) {
      const content: string = await readSymbolSvg(iconName);
      expect(content).toContain(`Generated from ${SYMBOL_NAME_PREFIX}${iconName}</text>`);

      for (const variant of template.variants) {
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
        const width: number = boundingBox.maxX - boundingBox.minX;
        const height: number = boundingBox.maxY - boundingBox.minY;

        // the artwork is maximally scaled: it fills the cell in at least one dimension
        // (width-limited for wide icons, height-limited otherwise)
        expect(Math.max(width / variant.cellWidth, height / cellHeight)).toBeCloseTo(1, 2);
        // centered horizontally in the cell, vertically between capline and baseline
        expect((boundingBox.minX + boundingBox.maxX) / 2).toBeCloseTo(variant.cellWidth / 2, 2);
        expect((boundingBox.minY + boundingBox.maxY) / 2).toBeCloseTo(-cellHeight / 2, 2);
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
