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
const FIXTURE_ICON_NAMES: readonly string[] = ['circle-check-filled', 'magnifying-glass', 'pencil'];
const FIXTURE_PATH_COUNTS: Readonly<Record<string, number>> = {
  'circle-check-filled': 1,
  'magnifying-glass': 2,
  pencil: 2,
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
        expect(boundingBox.maxY - boundingBox.minY).toBeCloseTo(cellHeight, 2);
        expect(boundingBox.maxY).toBeCloseTo(0, 2);
        expect(boundingBox.minY).toBeCloseTo(-cellHeight, 2);
        expect((boundingBox.minX + boundingBox.maxX) / 2).toBeCloseTo(variant.cellWidth / 2, 2);
      }
    }
  });

  test('preserves the winding rule of each fixture', async () => {
    const filledContent: string = await readSymbolSvg('circle-check-filled');
    expect(filledContent).toContain('fill-rule="evenodd"');
    expect(filledContent.match(WIREFRAME_PATH_PATTERN)).toHaveLength(
      FIXTURE_PATH_COUNTS['circle-check-filled']! * template.variants.length,
    );

    const strokeContent: string = await readSymbolSvg('pencil');
    expect(strokeContent).not.toContain('fill-rule');
    expect(strokeContent.match(WIREFRAME_PATH_PATTERN)).toHaveLength(
      FIXTURE_PATH_COUNTS['pencil']! * template.variants.length,
    );
  });
});
