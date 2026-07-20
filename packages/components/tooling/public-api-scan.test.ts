import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildGlobExcludePatterns,
  buildGlobPatterns,
  getPublicApiSourceFiles,
  isExcludedFile,
} from './public-api-scan.ts';

describe('public-api-scan', () => {
  describe('buildGlobPatterns', () => {
    it('should only match .ts files', () => {
      expect(buildGlobPatterns()).toEqual(['**/*.ts']);
    });
  });

  describe('buildGlobExcludePatterns', () => {
    it('should exclude public-api.ts and suffixed files', () => {
      const patterns = buildGlobExcludePatterns();

      expect(patterns).toContain('**/public-api.ts');
      expect(patterns).toContain('**/*.{private,styles,test,stories,mock}.ts');
      expect(patterns).toContain('**/*.{private,styles,test,stories,mock}.d.ts');
      expect(patterns).toContain('**/*.{private,styles,test,stories,mock}/**/*.ts');
      expect(patterns).toContain('**/*.{private,styles,test,stories,mock}/**/*.d.ts');
    });
  });

  describe('isExcludedFile', () => {
    it.each([
      { name: 'foo.ts', expected: false },
      { name: 'foo.d.ts', expected: false },
      { name: 'foo.private.ts', expected: true },
      { name: 'foo.private.d.ts', expected: true },
      { name: 'foo.test.ts', expected: true },
      { name: 'foo.stories.ts', expected: true },
      { name: 'foo.mock.ts', expected: true },
      { name: 'foo.styles.ts', expected: true },
      { name: 'public-api.ts', expected: true },
      { name: 'foo.js', expected: true },
      { name: 'foo.json', expected: true },
    ])('isExcludedFile("$name") returns $expected', ({ name, expected }) => {
      expect(isExcludedFile(name)).toBe(expected);
    });
  });

  describe('getPublicApiSourceFiles', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-api-scan-'));

      const tree = [
        'foo.ts',
        'bar.d.ts',
        'quz.private.ts',
        'quz.private.d.ts',
        'baz.test.ts',
        'qux.stories.ts',
        'quux.mock.ts',
        'public-api.ts',
        'corge.js',
        'sub/deep.ts',
        'sub/ignored.test.ts',
        'sub/nested.private.d.ts',
        'react/wrapper.ts',
        'react/index.ts',
      ];

      for (const file of tree) {
        const filePath = path.join(tmpDir, file);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, 'export {}');
      }
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should include plain .ts and .d.ts files', async () => {
      const result = await getPublicApiSourceFiles(tmpDir);
      const relativePaths = result.map((r) => r.relativePath).sort();

      expect(relativePaths).toEqual(['bar.d.ts', 'foo.ts', 'sub/deep.ts']);
    });

    it('should exclude react directory files from main barrel', async () => {
      const result = await getPublicApiSourceFiles(tmpDir);
      const relativePaths = result.map((r) => r.relativePath);

      expect(relativePaths).not.toContain('react/wrapper.ts');
      expect(relativePaths).not.toContain('react/index.ts');
    });

    it('should resolve absolute paths inside the given directory', async () => {
      const result = await getPublicApiSourceFiles(tmpDir);

      for (const file of result) {
        expect(path.isAbsolute(file.absolutePath)).toBe(true);
        expect(file.absolutePath.startsWith(tmpDir)).toBe(true);
      }
    });
  });
});
