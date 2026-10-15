import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildOutputPath,
  filterEntries,
  groupEntriesByTitle,
  orderTitleGroups,
  parseStorybookIndex,
  slugifySegment,
  slugifyTitle,
} from './index-entries.ts';
import type { IndexEntry, IndexEntryType, TitleGroup } from './types.ts';

const SOURCE_DIR = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(SOURCE_DIR, '__fixtures__');
const REAL_INDEX_PATH = join(SOURCE_DIR, '..', '..', '..', 'storybook-static', 'index.json');

function readFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf8');
}

function entry(
  overrides: Partial<IndexEntry> & Pick<IndexEntry, 'id' | 'title' | 'name'>,
): IndexEntry {
  return {
    importPath: './src/stories/example.mdx',
    type: 'docs',
    tags: ['dev', 'test', 'manifest'],
    ...overrides,
  };
}

function group(title: string): TitleGroup {
  return { title, storyEntries: [] };
}

describe('parseStorybookIndex', () => {
  it('parses a valid storybook index fixture', () => {
    const index = parseStorybookIndex(readFixture('index-valid.json'));
    expect(index.v).toBe(5);
    expect(Object.keys(index.entries)).toHaveLength(3);
    expect(index.entries['components-button--docs'].importPath).toBe(
      '../../packages/components/src/components/esds-button/esds-button.attr.stories.ts',
    );
    expect(index.entries['components-button--button'].exportName).toBe('Button');
  });

  it('throws when v is not a number', () => {
    expect(() => parseStorybookIndex(readFixture('index-invalid-v.json'))).toThrow(
      'Invalid storybook index',
    );
  });

  it('throws when entries is an array', () => {
    expect(() => parseStorybookIndex(readFixture('index-invalid-entries-array.json'))).toThrow(
      'Invalid storybook index',
    );
  });

  it('throws when entries is null', () => {
    expect(() => parseStorybookIndex(readFixture('index-invalid-entries-null.json'))).toThrow(
      'Invalid storybook index',
    );
  });

  it('throws when entries is not an object', () => {
    expect(() => parseStorybookIndex(readFixture('index-invalid-entries-number.json'))).toThrow(
      'Invalid storybook index',
    );
  });

  it('throws when the root is not an object', () => {
    expect(() => parseStorybookIndex(readFixture('index-invalid-root-array.json'))).toThrow(
      'Invalid storybook index',
    );
  });

  it('throws when the raw content is not valid JSON', () => {
    expect(() => parseStorybookIndex(readFixture('index-not-json.txt'))).toThrow(
      'Invalid storybook index',
    );
  });
});

describe('filterEntries', () => {
  it('keeps public entries with unrelated tags', () => {
    const kept = entry({
      id: 'a',
      title: 'Welcome',
      name: 'Docs',
      tags: ['dev', 'manifest', 'vr-test'],
    });
    expect(filterEntries([kept])).toEqual([kept]);
  });

  it('drops entries tagged test-only, internal or with an underscore-prefixed name', () => {
    const testOnly = entry({ id: 'a', title: 'Welcome', name: 'Docs', tags: ['test-only'] });
    const internal = entry({ id: 'b', title: 'Welcome', name: 'Docs', tags: ['internal'] });
    const underscore = entry({ id: 'c', title: 'Welcome', name: '_hidden' });
    const kept = entry({ id: 'd', title: 'Welcome', name: 'Docs' });
    expect(filterEntries([testOnly, internal, underscore, kept])).toEqual([kept]);
  });
});

describe('groupEntriesByTitle', () => {
  it('groups docs and story entries by title in first-seen order', () => {
    const docsButton = entry({ id: 'b--docs', title: 'Components/Button', name: 'Docs' });
    const storyButton = entry({
      id: 'b--button',
      title: 'Components/Button',
      name: 'Button',
      type: 'story',
    });
    const docsWelcome = entry({ id: 'w--docs', title: 'Welcome', name: 'Docs' });
    expect(groupEntriesByTitle([docsButton, storyButton, docsWelcome])).toEqual([
      { title: 'Components/Button', docsEntry: docsButton, storyEntries: [storyButton] },
      { title: 'Welcome', docsEntry: docsWelcome, storyEntries: [] },
    ]);
  });

  it('keeps only the first docs entry for a title', () => {
    const first = entry({ id: 'first', title: 'X', name: 'Docs' });
    const second = entry({ id: 'second', title: 'X', name: 'Docs' });
    expect(groupEntriesByTitle([first, second])).toEqual([
      { title: 'X', docsEntry: first, storyEntries: [] },
    ]);
  });

  it('collects multiple story entries in input order', () => {
    const docs = entry({ id: 'docs', title: 'X', name: 'Docs' });
    const storyA = entry({ id: 'a', title: 'X', name: 'A', type: 'story' });
    const storyB = entry({ id: 'b', title: 'X', name: 'B', type: 'story' });
    expect(groupEntriesByTitle([docs, storyB, storyA])).toEqual([
      { title: 'X', docsEntry: docs, storyEntries: [storyB, storyA] },
    ]);
  });

  it('creates a story-only group when a title has no docs entry', () => {
    const story = entry({ id: 's', title: 'X', name: 'Story', type: 'story' });
    expect(groupEntriesByTitle([story])).toEqual([{ title: 'X', storyEntries: [story] }]);
  });

  it('drops entries without a title', () => {
    const untitled = entry({ id: 'u', title: undefined as unknown as string, name: 'Docs' });
    const emptyTitle = entry({ id: 'e', title: '', name: 'Docs' });
    expect(groupEntriesByTitle([untitled, emptyTitle])).toEqual([]);
  });

  it('ignores entries with an unknown type', () => {
    const unknownType = entry({
      id: 'w',
      title: 'X',
      name: 'Docs',
      type: 'other' as IndexEntryType,
    });
    expect(groupEntriesByTitle([unknownType])).toEqual([{ title: 'X', storyEntries: [] }]);
  });
});

describe('slugifySegment', () => {
  it.each([
    ['Text Link', 'text-link'],
    ['Android - Technical Limitations', 'android-technical-limitations'],
    ['DESIGN.md', 'design-md'],
    ['Help and Feedback', 'help-and-feedback'],
    ['iOS - iPadOS Kit', 'ios-ipados-kit'],
    ['T1', 't1'],
    ['Help & Feedback', 'help-feedback'],
    ['  Spaced   Out  ', 'spaced-out'],
    ['&/!?', ''],
  ])('slugifies %s to %s', (input, expected) => {
    expect(slugifySegment(input)).toBe(expected);
  });
});

describe('slugifyTitle', () => {
  it('splits and slugifies each segment', () => {
    expect(slugifyTitle('Design Tokens/T1/Color')).toEqual(['design-tokens', 't1', 'color']);
  });

  it('trims segments and drops empty ones', () => {
    expect(slugifyTitle(' Designers Guide // iOS - iPadOS Kit /')).toEqual([
      'designers-guide',
      'ios-ipados-kit',
    ]);
  });

  it('returns a single slug for titles without a separator', () => {
    expect(slugifyTitle('Help and Feedback')).toEqual(['help-and-feedback']);
  });
});

describe('buildOutputPath', () => {
  it('joins slug parts under llms with an md extension', () => {
    expect(buildOutputPath(['design-tokens', 't1', 'color'])).toBe(
      'llms/design-tokens/t1/color.md',
    );
  });

  it('handles empty slug parts', () => {
    expect(buildOutputPath([])).toBe('llms/.md');
  });
});

describe('orderTitleGroups', () => {
  it('orders known categories first then unknown categories alphabetically', () => {
    const groups = [
      group('Zeta/Page'),
      group('Components/Button'),
      group('Typography'),
      group('AI & LLMs'),
      group('Icons/Getting Started'),
      group('alpha/Page'),
      group('Welcome'),
      group('Design Tokens/T1/Color'),
      group('Designers Guide/Figma Plugins'),
    ];
    expect(orderTitleGroups(groups).map((g) => g.title)).toEqual([
      'Welcome',
      'Designers Guide/Figma Plugins',
      'Design Tokens/T1/Color',
      'Icons/Getting Started',
      'Typography',
      'AI & LLMs',
      'Components/Button',
      'alpha/Page',
      'Zeta/Page',
    ]);
  });

  it('puts Getting Started first and CHANGELOG last within a category', () => {
    const groups = [
      group('Components/CHANGELOG'),
      group('Components/Button'),
      group('Components/Getting Started'),
      group('Components/Icon'),
    ];
    expect(orderTitleGroups(groups).map((g) => g.title)).toEqual([
      'Components/Getting Started',
      'Components/Button',
      'Components/Icon',
      'Components/CHANGELOG',
    ]);
  });

  it('sorts remaining pages alphabetically case-insensitively', () => {
    const groups = [
      group('Design Tokens/Color'),
      group('Design Tokens/blur'),
      group('Design Tokens/Alpha'),
    ];
    expect(orderTitleGroups(groups).map((g) => g.title)).toEqual([
      'Design Tokens/Alpha',
      'Design Tokens/blur',
      'Design Tokens/Color',
    ]);
  });

  it('ties Getting Started pages and CHANGELOG pages alphabetically', () => {
    const groups = [
      group('Designers Guide/B/Getting Started'),
      group('Designers Guide/A/CHANGELOG'),
      group('Designers Guide/A/Getting Started'),
      group('Designers Guide/B/CHANGELOG'),
    ];
    expect(orderTitleGroups(groups).map((g) => g.title)).toEqual([
      'Designers Guide/A/Getting Started',
      'Designers Guide/B/Getting Started',
      'Designers Guide/A/CHANGELOG',
      'Designers Guide/B/CHANGELOG',
    ]);
  });

  it('groups pages of the same unknown category and applies page ordering inside', () => {
    const groups = [
      group('My Kit/Getting Started'),
      group('My Kit/Page'),
      group('My Kit/CHANGELOG'),
      group('Other/Getting Started'),
      group('Other/Page'),
    ];
    expect(orderTitleGroups(groups).map((g) => g.title)).toEqual([
      'My Kit/Getting Started',
      'My Kit/Page',
      'My Kit/CHANGELOG',
      'Other/Getting Started',
      'Other/Page',
    ]);
  });

  it('compares a bare category title against a subpage of the same category', () => {
    const groups = [group('Typography/Sub Page'), group('Typography')];
    expect(orderTitleGroups(groups).map((g) => g.title)).toEqual([
      'Typography',
      'Typography/Sub Page',
    ]);
  });

  it('keeps input order for titles that compare equal case-insensitively', () => {
    const first = group('X/Alpha');
    const second = group('X/alpha');
    expect(orderTitleGroups([first, second])).toEqual([first, second]);
    expect(orderTitleGroups([second, first])).toEqual([second, first]);
  });

  it('does not mutate the input array', () => {
    const groups = [group('Components/Button'), group('Welcome')];
    const copy = [...groups];
    orderTitleGroups(groups);
    expect(groups).toEqual(copy);
  });
});

describe('real storybook index', () => {
  it('parses, filters, groups and orders the real build artifact', () => {
    const index = parseStorybookIndex(readFileSync(REAL_INDEX_PATH, 'utf8'));
    const groups = orderTitleGroups(
      groupEntriesByTitle(filterEntries(Object.values(index.entries))),
    );
    expect(groups).toHaveLength(58);
    expect(groups[0].title).toBe('Welcome');
    expect(groups.some((g) => g.title.startsWith('Components/'))).toBe(true);
    const button = groups.find((g) => g.title === 'Components/Button');
    expect(button?.docsEntry).toBeDefined();
    expect(button?.storyEntries).toHaveLength(5);
  });
});
