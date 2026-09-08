import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { buildSvgSetFromSvgDirectory } from './build-svg-set-from-svg-directory.ts';

describe('buildSvgSetFromSvgDirectory', () => {
  let tempDir: string;
  let outputDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'svg-test-'));
    outputDir = join(tempDir, 'output');
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('reads categories from metadata and writes them to iconify JSON output', async () => {
    const logger = Logger.root();

    await writeFile(
      join(tempDir, 'test-icon.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
    );

    await writeFile(
      join(tempDir, 'test-icon.metadata.json'),
      JSON.stringify({
        tags: ['circle', 'round'],
        categories: ['filled', 'kdrive'],
      }),
    );

    await buildSvgSetFromSvgDirectory({
      sourceDirectory: tempDir,
      outputDirectory: outputDir,
      prefix: 'test',
      version: '0.0.0-test',
      logger,
      compareWithExistingVersion: false,
    });

    const outputRaw = await readFile(join(outputDir, 'test.json'), { encoding: 'utf8' });
    const outputJson = JSON.parse(outputRaw);

    expect(outputJson.categories).toBeDefined();
    expect(outputJson.categories['@all']).toContain('test-icon');
    expect(outputJson.categories['@filled']).toContain('test-icon');
    expect(outputJson.categories['@kdrive']).toContain('test-icon');
    expect(outputJson.categories['#circle']).toContain('test-icon');
    expect(outputJson.categories['#round']).toContain('test-icon');
  });

  it('handles missing metadata file gracefully - still adds @all category', async () => {
    const logger = Logger.root();

    await writeFile(
      join(tempDir, 'test-icon.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
    );

    await buildSvgSetFromSvgDirectory({
      sourceDirectory: tempDir,
      outputDirectory: outputDir,
      prefix: 'test',
      version: '0.0.0-test',
      logger,
      compareWithExistingVersion: false,
    });

    const outputRaw = await readFile(join(outputDir, 'test.json'), { encoding: 'utf8' });
    const outputJson = JSON.parse(outputRaw);

    expect(outputJson.categories).toBeDefined();
    expect(outputJson.categories['@all']).toContain('test-icon');
  });

  it('imports nested svg files as icons when no sub directory is excluded', async () => {
    const logger = Logger.root();

    await writeFile(
      join(tempDir, 'test-icon.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
    );
    await mkdir(join(tempDir, 'outlines'), { recursive: true });
    await writeFile(
      join(tempDir, 'outlines', 'test-icon.outline.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>`,
    );

    await buildSvgSetFromSvgDirectory({
      sourceDirectory: tempDir,
      outputDirectory: outputDir,
      prefix: 'test',
      version: '0.0.0-test',
      logger,
      compareWithExistingVersion: false,
    });

    const outputJson = JSON.parse(
      await readFile(join(outputDir, 'test.json'), { encoding: 'utf8' }),
    );

    expect(Object.keys(outputJson.icons)).toContain('test-icon');
    expect(Object.keys(outputJson.icons)).toContain('test-icon-outline');
  });

  it('excludes nested svg files from excluded sub directories', async () => {
    const logger = Logger.root();

    await writeFile(
      join(tempDir, 'test-icon.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
    );
    await mkdir(join(tempDir, 'outlines'), { recursive: true });
    await writeFile(
      join(tempDir, 'outlines', 'test-icon.outline.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>`,
    );
    await mkdir(join(tempDir, 'outlines', 'nested'), { recursive: true });
    await writeFile(
      join(tempDir, 'outlines', 'nested', 'nested-icon.outline.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>`,
    );
    await mkdir(join(tempDir, 'kept'), { recursive: true });
    await writeFile(
      join(tempDir, 'kept', 'kept-icon.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>`,
    );

    await buildSvgSetFromSvgDirectory({
      sourceDirectory: tempDir,
      outputDirectory: outputDir,
      prefix: 'test',
      version: '0.0.0-test',
      logger,
      compareWithExistingVersion: false,
      excludeSubDirectories: ['outlines'],
    });

    const outputJson = JSON.parse(
      await readFile(join(outputDir, 'test.json'), { encoding: 'utf8' }),
    );

    expect(Object.keys(outputJson.icons)).toContain('test-icon');
    expect(Object.keys(outputJson.icons)).toContain('kept-icon');
    expect(Object.keys(outputJson.icons)).not.toContain('test-icon-outline');
    expect(Object.keys(outputJson.icons)).not.toContain('nested-icon-outline');
  });
});
