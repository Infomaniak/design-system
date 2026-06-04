import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { writeJsonFileSafe } from './write-json-file-safe.ts';

describe('writeJsonFileSafe', () => {
  it('should write JSON with a trailing newline', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'write-json-test-'));
    const filePath = join(tempDir, 'test.json');

    try {
      await writeJsonFileSafe(filePath, { key: 'value' });

      const content = await readFile(filePath, 'utf8');

      expect(content.endsWith('\n')).toBe(true);
      expect(JSON.parse(content)).toEqual({ key: 'value' });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
