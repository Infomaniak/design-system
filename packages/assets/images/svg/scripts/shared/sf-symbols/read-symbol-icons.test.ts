import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { readSymbolIcons } from './read-symbol-icons.ts';

const logger = Logger.never();

describe('readSymbolIcons', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'read-symbol-icons-'));
  });

  afterEach(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  const writeOutline = async (fileName: string, content: string): Promise<void> => {
    await writeFile(join(tempDir, fileName), content, { encoding: 'utf8' });
  };

  const validOutline = (path: string, fillRule = ''): string => {
    return `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="black"${fillRule}/>
</svg>
`;
  };

  test('reads outline files sorted by name with their winding rules', async () => {
    await writeOutline('b-square.outline.svg', validOutline('M 4 4 L 20 4 L 20 20 Z'));
    await writeOutline('a-ring.outline.svg', validOutline('M 1 1 L 2 2 Z', ' fill-rule="evenodd"'));
    await writeOutline('readme.md', 'ignored');
    await writeOutline('.DS_Store', 'ignored');

    const icons = await readSymbolIcons({ outlinesDirectory: tempDir, logger });

    expect(icons.map(({ name }) => name)).toEqual(['a-ring', 'b-square']);
    expect(icons[0]!.outlinedPaths).toEqual([{ d: 'M 1 1 L 2 2 Z', windingRule: 'EVENODD' }]);
    expect(icons[1]!.outlinedPaths).toEqual([
      { d: 'M 4 4 L 20 4 L 20 20 Z', windingRule: 'NONZERO' },
    ]);
  });

  test('parses multiple path elements from a single file', async () => {
    await writeOutline(
      'multi.outline.svg',
      `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M 1 1 L 2 2 Z" fill="black"/>
  <path d="M 3 3 L 4 4 Z" fill="black" fill-rule="evenodd"/>
</svg>
`,
    );

    const icons = await readSymbolIcons({ outlinesDirectory: tempDir, logger });

    expect(icons[0]!.outlinedPaths).toEqual([
      { d: 'M 1 1 L 2 2 Z', windingRule: 'NONZERO' },
      { d: 'M 3 3 L 4 4 Z', windingRule: 'EVENODD' },
    ]);
  });

  test('throws when the outlines directory is empty', async () => {
    await expect(readSymbolIcons({ outlinesDirectory: tempDir, logger })).rejects.toThrow(
      `No outline files found in ${JSON.stringify(tempDir)}.`,
    );
  });

  test('throws a clear error when the outlines directory does not exist', async () => {
    const missingDirectory: string = join(tempDir, 'does-not-exist');

    await expect(readSymbolIcons({ outlinesDirectory: missingDirectory, logger })).rejects.toThrow(
      `Outlines directory ${JSON.stringify(missingDirectory)} does not exist. Run the Figma icons import first: the import pull request commits the outline files.`,
    );
  });

  test('rethrows unexpected directory read errors', async () => {
    const filePath: string = join(tempDir, 'file.txt');
    await writeFile(filePath, 'not a directory');

    await expect(readSymbolIcons({ outlinesDirectory: filePath, logger })).rejects.toThrow(
      /ENOTDIR/,
    );
  });

  test('throws on an invalid outline file name', async () => {
    await writeOutline('Bad_Name.outline.svg', validOutline('M 1 1 L 2 2 Z'));

    await expect(readSymbolIcons({ outlinesDirectory: tempDir, logger })).rejects.toThrow(
      'Invalid outline file name "Bad_Name.outline.svg".',
    );
  });

  test('throws on an unexpected viewBox', async () => {
    await writeOutline(
      'test.outline.svg',
      validOutline('M 1 1 L 2 2 Z').replace('viewBox="0 0 24 24"', 'viewBox="0 0 32 32"'),
    );

    await expect(readSymbolIcons({ outlinesDirectory: tempDir, logger })).rejects.toThrow(
      'Unexpected viewBox in outline file "test.outline.svg"',
    );
  });

  test('throws when no path element can be parsed', async () => {
    await writeOutline(
      'test.outline.svg',
      `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24"/>
</svg>
`,
    );

    await expect(readSymbolIcons({ outlinesDirectory: tempDir, logger })).rejects.toThrow(
      'Unexpected path elements in outline file "test.outline.svg": parsed 0 of 0.',
    );
  });

  test('throws on unconsumed path elements', async () => {
    await writeOutline(
      'test.outline.svg',
      `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M 1 1 L 2 2 Z" fill="black"/>
  <path d="M 3 3 L 4 4 Z" fill="red"/>
</svg>
`,
    );

    await expect(readSymbolIcons({ outlinesDirectory: tempDir, logger })).rejects.toThrow(
      'Unexpected path elements in outline file "test.outline.svg": parsed 1 of 2.',
    );
  });

  test('warns for web icons without an outline file and keeps reading outlines', async () => {
    await writeOutline('has-outline.outline.svg', validOutline('M 1 1 L 2 2 Z'));
    const webIconsDirectory: string = join(tempDir, 'web');
    await mkdir(webIconsDirectory, { recursive: true });
    await writeFile(join(webIconsDirectory, 'has-outline.svg'), '<svg/>', { encoding: 'utf8' });
    await writeFile(join(webIconsDirectory, 'missing-outline.svg'), '<svg/>', { encoding: 'utf8' });
    await writeFile(join(webIconsDirectory, 'missing-outline.mask.svg'), '<svg/>', {
      encoding: 'utf8',
    });
    await writeFile(join(webIconsDirectory, 'missing-outline.metadata.json'), '{}', {
      encoding: 'utf8',
    });

    const warnings: unknown[][] = [];
    const warnLogger: Logger = new Logger('$TEST', {
      logLevel: {
        warn: (_name: string, args: unknown[]): void => {
          warnings.push(args);
        },
      },
    });

    const icons = await readSymbolIcons({
      outlinesDirectory: tempDir,
      webIconsDirectory,
      logger: warnLogger,
    });

    expect(icons.map(({ name }): string => name)).toEqual(['has-outline']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]![0]).toBe(
      '1 icon(s) have no outline file; no SF Symbol will be generated for them: "missing-outline".',
    );
  });

  test('warns for outline files without a corresponding web svg', async () => {
    await writeOutline('known.outline.svg', validOutline('M 1 1 L 2 2 Z'));
    await writeOutline('orphan.outline.svg', validOutline('M 1 1 L 2 2 Z'));
    const webIconsDirectory: string = join(tempDir, 'web');
    await mkdir(webIconsDirectory, { recursive: true });
    await writeFile(join(webIconsDirectory, 'known.svg'), '<svg/>', { encoding: 'utf8' });

    const warnings: unknown[][] = [];
    const warnLogger: Logger = new Logger('$TEST', {
      logLevel: {
        warn: (_name: string, args: unknown[]): void => {
          warnings.push(args);
        },
      },
    });

    const icons = await readSymbolIcons({
      outlinesDirectory: tempDir,
      webIconsDirectory,
      logger: warnLogger,
    });

    expect(icons.map(({ name }): string => name)).toEqual(['known', 'orphan']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]![0]).toBe('1 outline file(s) have no corresponding web SVG icon: "orphan".');
  });

  test('does not warn when outlines and web icons match', async () => {
    await writeOutline('a.outline.svg', validOutline('M 1 1 L 2 2 Z'));
    const webIconsDirectory: string = join(tempDir, 'web');
    await mkdir(webIconsDirectory, { recursive: true });
    await writeFile(join(webIconsDirectory, 'a.svg'), '<svg/>', { encoding: 'utf8' });

    const warnings: unknown[][] = [];
    const warnLogger: Logger = new Logger('$TEST', {
      logLevel: {
        warn: (_name: string, args: unknown[]): void => {
          warnings.push(args);
        },
      },
    });

    await readSymbolIcons({
      outlinesDirectory: tempDir,
      webIconsDirectory,
      logger: warnLogger,
    });

    expect(warnings).toHaveLength(0);
  });

  test('throws when the web icons directory does not exist', async () => {
    await writeOutline('a.outline.svg', validOutline('M 1 1 L 2 2 Z'));
    const missingDirectory: string = join(tempDir, 'does-not-exist');

    await expect(
      readSymbolIcons({ outlinesDirectory: tempDir, webIconsDirectory: missingDirectory, logger }),
    ).rejects.toThrow(`Web icons directory ${JSON.stringify(missingDirectory)} does not exist.`);
  });
});
