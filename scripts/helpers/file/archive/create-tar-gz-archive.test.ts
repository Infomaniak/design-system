import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTarGzArchive } from './create-tar-gz-archive.ts';

const execFileAsync = promisify(execFile);

describe('createTarGzArchive', () => {
  let tempDir: string;
  let sourceDir: string;
  let outputDir: string;
  let extractDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'tar-gz-archive-test-'));
    sourceDir = join(tempDir, 'source');
    outputDir = join(tempDir, 'output');
    extractDir = join(tempDir, 'extract');
    await mkdir(sourceDir);
    await mkdir(outputDir);
    await mkdir(extractDir);
    await writeFile(join(sourceDir, 'inter.woff2'), new Uint8Array([0, 1, 2, 3]));
    await writeFile(join(sourceDir, 'inter.min.css'), 'body{}');
    await writeFile(join(sourceDir, 'ignored.txt'), 'ignored');
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('creates an archive containing only the selected files', async () => {
    const archivePath: string = await createTarGzArchive({
      sourceDirectory: sourceDir,
      fileNames: ['inter.woff2', 'inter.min.css'],
      outputDirectory: outputDir,
      archiveName: 'fonts-prod-abc123d.tar.gz',
    });

    expect(archivePath).toBe(join(outputDir, 'fonts-prod-abc123d.tar.gz'));

    await execFileAsync('tar', ['-xzf', archivePath, '-C', extractDir]);

    expect((await readdir(extractDir)).sort()).toEqual(['inter.min.css', 'inter.woff2']);

    const woff2: Buffer = await readFile(join(extractDir, 'inter.woff2'));
    expect(woff2).toEqual(Buffer.from([0, 1, 2, 3]));
  });

  it('defaults to "archive.tar.gz" in a fresh temp output directory', async () => {
    const archivePath: string = await createTarGzArchive({
      sourceDirectory: sourceDir,
      fileNames: ['inter.woff2'],
    });

    expect(archivePath).toMatch(/tar-gz-archive-.*[\\/]archive\.tar\.gz$/);
  });

  it('rejects when the source directory does not exist', async () => {
    await expect(
      createTarGzArchive({
        sourceDirectory: join(sourceDir, 'missing'),
        fileNames: ['inter.woff2'],
      }),
    ).rejects.toThrow(/Failed to create tar\.gz archive/);
  });
});
