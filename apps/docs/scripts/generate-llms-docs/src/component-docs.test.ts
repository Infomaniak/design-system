import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import {
  extractComponentTag,
  extractRawDocImportPath,
  loadComponentDocs,
  resolveImportPath,
} from './component-docs.ts';

const FIXTURES_DIRECTORY: string = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__');
const SEPARATOR_STORIES_PATH =
  'packages/components/src/components/esds-separator/esds-separator.component.stories.ts';
const SEPARATOR_COMPANION_PATH =
  'packages/components/src/components/esds-separator/esds-separator.component.md';

function readFixture(fixtureName: string): string {
  return readFileSync(join(FIXTURES_DIRECTORY, fixtureName), 'utf8');
}

describe('extractRawDocImportPath', () => {
  it('returns the companion md import path with the ?raw suffix stripped', () => {
    expect(extractRawDocImportPath(readFixture('separator.component.stories.txt'))).toBe(
      './esds-separator.component.md',
    );
  });

  it('returns null when the stories file declares no raw md import', () => {
    expect(extractRawDocImportPath(readFixture('plain-stories.txt'))).toBeNull();
  });
});

describe('extractComponentTag', () => {
  it('returns the component tag from the meta object', () => {
    expect(extractComponentTag(readFixture('separator.component.stories.txt'))).toBe(
      'esds-separator',
    );
  });

  it('returns null when the meta object declares no component', () => {
    expect(extractComponentTag(readFixture('plain-stories.txt'))).toBeNull();
  });
});

describe('resolveImportPath', () => {
  it('resolves a sibling import relative to the stories file directory', () => {
    expect(resolveImportPath(SEPARATOR_STORIES_PATH, './esds-separator.component.md')).toBe(
      SEPARATOR_COMPANION_PATH,
    );
  });

  it('resolves parent directory imports from nested stories paths', () => {
    expect(
      resolveImportPath(
        'apps/docs/src/stories/tokens/t2/color.stories.ts',
        '../../assets/t2-color.md',
      ),
    ).toBe('apps/docs/src/stories/assets/t2-color.md');
  });

  it('resolves imports for files without a directory prefix', () => {
    expect(resolveImportPath('stories.ts', './x.md')).toBe('x.md');
  });
});

describe('loadComponentDocs', () => {
  it('loads the companion md prose and extracts the component tag', () => {
    const readFile = vi.fn(() => readFixture('separator.component.md'));
    expect(
      loadComponentDocs({
        storiesFilePath: SEPARATOR_STORIES_PATH,
        storiesSource: readFixture('separator.component.stories.txt'),
        readFile,
      }),
    ).toEqual({ tagName: 'esds-separator', prose: readFixture('separator.component.md') });
    expect(readFile).toHaveBeenCalledWith(SEPARATOR_COMPANION_PATH);
  });

  it('returns null prose when the stories file declares no companion md import', () => {
    const readFile = vi.fn(() => 'unused');
    expect(
      loadComponentDocs({
        storiesFilePath: SEPARATOR_STORIES_PATH,
        storiesSource: readFixture('plain-stories.txt'),
        readFile,
      }),
    ).toEqual({ tagName: null, prose: null });
    expect(readFile).not.toHaveBeenCalled();
  });

  it('returns null prose when reading the companion md throws', () => {
    const readFile = vi.fn(() => {
      throw new Error('ENOENT: no such file');
    });
    expect(
      loadComponentDocs({
        storiesFilePath: SEPARATOR_STORIES_PATH,
        storiesSource: readFixture('separator.component.stories.txt'),
        readFile,
      }),
    ).toEqual({ tagName: 'esds-separator', prose: null });
  });
});
