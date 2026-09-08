import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { buildSymbolsXcassets, type SymbolIcon } from './build-symbols-xcassets.ts';
import { readSymbolTemplate } from './parse-symbol-template.ts';

const SQUARE_ICON: SymbolIcon = {
  name: 'square',
  outlinedPaths: [{ d: 'M 4 4 L 20 4 L 20 20 L 4 20 Z', windingRule: 'NONZERO' }],
};

const EVENODD_ICON: SymbolIcon = {
  name: 'evenodd',
  outlinedPaths: [{ d: 'M 4 4 L 20 4 L 20 20 Z', windingRule: 'EVENODD' }],
};

describe('buildSymbolsXcassets', () => {
  test('writes one symbolset per icon', async () => {
    const outputDirectory: string = await mkdtemp(join(tmpdir(), 'sf-symbols-xcassets-'));
    try {
      const template = await readSymbolTemplate();
      await buildSymbolsXcassets({
        outputDirectory,
        template,
        icons: [SQUARE_ICON, EVENODD_ICON],
        logger: Logger.never(),
      });

      const xcassetsDirectory: string = join(outputDirectory, 'ESDSSymbols.xcassets');
      expect(await readFile(join(xcassetsDirectory, 'Contents.json'), { encoding: 'utf8' })).toBe(
        `{
  "info": {
    "author": "xcode",
    "version": 1
  }
}
`,
      );

      const symbolsetContents: string = await readFile(
        join(xcassetsDirectory, 'esds-square.symbolset', 'Contents.json'),
        { encoding: 'utf8' },
      );
      expect(JSON.parse(symbolsetContents)).toEqual({
        info: { author: 'xcode', version: 1 },
        symbols: [{ filename: 'esds-square.symbol.svg', idiom: 'universal' }],
      });

      const symbolSvg: string = await readFile(
        join(xcassetsDirectory, 'esds-square.symbolset', 'esds-square.symbol.svg'),
        { encoding: 'utf8' },
      );
      expect(symbolSvg).toContain('Generated from esds-square');
      expect(symbolSvg).toContain('<g id="Regular-S"');
      expect(symbolSvg).toContain('<g id="Ultralight-S"');
      expect(symbolSvg).toContain('<g id="Black-S"');

      await expect(
        readFile(join(xcassetsDirectory, 'esds-evenodd.symbolset', 'Contents.json'), {
          encoding: 'utf8',
        }),
      ).resolves.toContain('esds-evenodd.symbol.svg');
    } finally {
      await rm(outputDirectory, { force: true, recursive: true });
    }
  });

  test('throws on an invalid icon name', async () => {
    const template = await readSymbolTemplate();
    await expect(
      buildSymbolsXcassets({
        outputDirectory: join(tmpdir(), 'unused'),
        template,
        icons: [{ ...SQUARE_ICON, name: 'Invalid Name' }],
        logger: Logger.never(),
      }),
    ).rejects.toThrow('Invalid icon name "Invalid Name".');
  });

  test('throws on a duplicated icon name', async () => {
    const template = await readSymbolTemplate();
    await expect(
      buildSymbolsXcassets({
        outputDirectory: join(tmpdir(), 'unused'),
        template,
        icons: [SQUARE_ICON, { ...SQUARE_ICON, outlinedPaths: EVENODD_ICON.outlinedPaths }],
        logger: Logger.never(),
      }),
    ).rejects.toThrow('Duplicated icon name "square".');
  });

  test('throws on an icon without outline paths', async () => {
    const template = await readSymbolTemplate();
    await expect(
      buildSymbolsXcassets({
        outputDirectory: join(tmpdir(), 'unused'),
        template,
        icons: [{ ...SQUARE_ICON, outlinedPaths: [] }],
        logger: Logger.never(),
      }),
    ).rejects.toThrow('Icon "square" has no outline paths.');
  });
});
