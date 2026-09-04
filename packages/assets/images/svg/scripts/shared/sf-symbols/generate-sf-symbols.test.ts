import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { generateSfSymbols } from './generate-sf-symbols.ts';
import { SYMBOL_NAME_PREFIX, SYMBOLS_XCASSETS_DIRECTORY_NAME } from './sf-symbols-config.ts';

const logger = Logger.never();

const OUTLINE_CONTENT = (path: string): string => {
  return `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="black"/>
</svg>
`;
};

describe('generateSfSymbols', () => {
  let tempDir: string;
  let outlinesDirectory: string;
  let webIconsDirectory: string;
  let outputDirectory: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'generate-sf-symbols-'));
    outlinesDirectory = join(tempDir, 'outlines');
    webIconsDirectory = join(tempDir, 'icons');
    outputDirectory = join(tempDir, 'dist', 'sf-symbols');
    await mkdir(outlinesDirectory, { recursive: true });
    await mkdir(webIconsDirectory, { recursive: true });
  });

  afterEach(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  const writeIcon = async (name: string, path: string): Promise<void> => {
    await writeFile(join(outlinesDirectory, `${name}.outline.svg`), OUTLINE_CONTENT(path), {
      encoding: 'utf8',
    });
    await writeFile(join(webIconsDirectory, `${name}.svg`), '<svg/>', { encoding: 'utf8' });
  };

  test('wipes the output directory and generates the xcassets from the outlines', async () => {
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(join(outputDirectory, 'stale.txt'), 'stale', { encoding: 'utf8' });
    await writeIcon('b-circle', 'M 4 4 L 20 4 L 20 20 Z');
    await writeIcon('a-square', 'M 1 1 L 2 2 Z');

    const icons = await generateSfSymbols({
      outputDirectory,
      outlinesDirectory,
      webIconsDirectory,
      logger,
    });

    expect(icons.map(({ name }) => name)).toEqual(['a-square', 'b-circle']);

    const xcassetsDirectory: string = join(outputDirectory, SYMBOLS_XCASSETS_DIRECTORY_NAME);
    const symbolsetDirectory: string = join(
      xcassetsDirectory,
      `${SYMBOL_NAME_PREFIX}a-square.symbolset`,
    );

    expect(JSON.parse(await readFile(join(xcassetsDirectory, 'Contents.json'), 'utf8'))).toEqual({
      info: { author: 'xcode', version: 1 },
    });
    expect(JSON.parse(await readFile(join(symbolsetDirectory, 'Contents.json'), 'utf8'))).toEqual({
      info: { author: 'xcode', version: 1 },
      symbols: [
        {
          filename: `${SYMBOL_NAME_PREFIX}a-square.symbol.svg`,
          idiom: 'universal',
        },
      ],
    });
    expect(await readdir(symbolsetDirectory)).toEqual([
      'Contents.json',
      `${SYMBOL_NAME_PREFIX}a-square.symbol.svg`,
    ]);
    await expect(readFile(join(outputDirectory, 'stale.txt'), 'utf8')).rejects.toThrow();
  });

  test('propagates outline parsing errors', async () => {
    await writeFile(join(outlinesDirectory, 'a-square.outline.svg'), '<svg viewBox="0 0 1 1"/>', {
      encoding: 'utf8',
    });

    await expect(
      generateSfSymbols({ outputDirectory, outlinesDirectory, webIconsDirectory, logger }),
    ).rejects.toThrow(`Unexpected viewBox in outline file "a-square.outline.svg"`);
  });
});
