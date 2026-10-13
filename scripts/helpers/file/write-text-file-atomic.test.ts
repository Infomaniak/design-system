import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { writeTextFileAtomic } from './write-text-file-atomic.ts';

describe('writeTextFileAtomic', () => {
  let temporaryDirectory: string;
  let filePath: string;

  beforeEach(async (): Promise<void> => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'write-atomic-test-'));
    filePath = join(temporaryDirectory, 'CHANGELOG.md');
  });

  afterEach(async (): Promise<void> => {
    await chmod(temporaryDirectory, 0o755);
    await rm(temporaryDirectory, { recursive: true, force: true });
  });

  it('writes the content to the file and leaves no temporary file behind', async () => {
    await writeTextFileAtomic(filePath, '# Changelog\n\n## 0.7.0\n');

    expect(await readFile(filePath, 'utf8')).toBe('# Changelog\n\n## 0.7.0\n');
    await expect(readFile(`${filePath}.tmp`, 'utf8')).rejects.toThrow();
  });

  it('replaces the content of an existing file', async () => {
    await writeFile(filePath, 'old content');

    await writeTextFileAtomic(filePath, 'new content');

    expect(await readFile(filePath, 'utf8')).toBe('new content');
  });

  it('rethrows the error and leaves the original file untouched when the temporary file cannot be written', async () => {
    await writeFile(filePath, 'original content');

    await chmod(temporaryDirectory, 0o555);

    await expect(writeTextFileAtomic(filePath, 'new content')).rejects.toThrowError(/EACCES/);

    expect(await readFile(filePath, 'utf8')).toBe('original content');
    await expect(readFile(`${filePath}.tmp`, 'utf8')).rejects.toThrow();
  });
});
