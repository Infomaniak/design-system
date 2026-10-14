import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { optimizeAndroidSvgs, optimizeSvg } from './optimize-android-svgs.ts';

const STROKED_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.000 9.000V13.000L14 15" stroke="black" stroke-width="1.75" stroke-linecap="round"/>
</svg>
`;

describe('optimizeSvg', () => {
  test('optimizes the SVG while keeping the stroke attributes', () => {
    expect(optimizeSvg(STROKED_ICON)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="1.75" d="M12 9v4l2 2"/></svg>',
    );
  });
});

describe('optimizeAndroidSvgs', () => {
  let sourceDirectory: string;
  let outputDirectory: string;

  beforeEach(async () => {
    const tempDir: string = await mkdtemp(join(tmpdir(), 'optimize-android-svgs-'));
    sourceDirectory = tempDir;
    outputDirectory = join(tempDir, 'dist', 'svgs');
  });

  afterEach(async () => {
    await rm(sourceDirectory, { force: true, recursive: true });
  });

  test('optimizes the stroked icons and skips the mask variants and other files', async () => {
    await writeFile(join(sourceDirectory, 'b-icon.svg'), STROKED_ICON, 'utf8');
    await writeFile(join(sourceDirectory, 'a-icon.svg'), STROKED_ICON, 'utf8');
    await writeFile(join(sourceDirectory, 'a-icon.mask.svg'), STROKED_ICON, 'utf8');
    await writeFile(join(sourceDirectory, 'a-icon.metadata.json'), '{}', 'utf8');

    expect(await optimizeAndroidSvgs({ sourceDirectory, outputDirectory })).toEqual([
      'a-icon.svg',
      'b-icon.svg',
    ]);
    expect((await readdir(outputDirectory)).sort()).toEqual(['a-icon.svg', 'b-icon.svg']);
    expect(await readFile(join(outputDirectory, 'a-icon.svg'), 'utf8')).toBe(
      optimizeSvg(STROKED_ICON),
    );
  });

  test('throws when there is no stroked icon', async () => {
    await expect(optimizeAndroidSvgs({ sourceDirectory, outputDirectory })).rejects.toThrow(
      `No stroked icons found in ${JSON.stringify(sourceDirectory)}.`,
    );
  });
});
