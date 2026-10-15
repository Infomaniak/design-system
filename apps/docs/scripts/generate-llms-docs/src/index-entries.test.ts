import { describe, expect, it } from 'vitest';
import {
  buildOutputPath,
  groupEntriesByTitle,
  orderTitleGroups,
  parseStorybookIndex,
  slugifySegment,
  slugifyTitle,
} from './index-entries.ts';
import type { IndexEntry } from './types.ts';

function entry(overrides: Partial<IndexEntry> & { id: string; title: string }): IndexEntry {
  return { name: 'Docs', importPath: './x.mdx', type: 'docs', tags: ['dev'], ...overrides };
}

function group(title: string): ReturnType<typeof groupEntriesByTitle>[number] {
  return { title, storyEntries: [] };
}

describe('parseStorybookIndex', () => {
  it('parses the raw index json', () => {
    const index = parseStorybookIndex(
      '{"v":5,"entries":{"a--docs":{"id":"a--docs","title":"A","name":"Docs","importPath":"./a.mdx","type":"docs","tags":["dev"]}}}',
    );
    expect(index.v).toBe(5);
    expect(Object.keys(index.entries)).toEqual(['a--docs']);
  });
});

describe('slugifySegment', () => {
  it('produces kebab slugs from the real title segments', () => {
    expect(slugifySegment('Text Link')).toBe('text-link');
    expect(slugifySegment('Android - Technical Limitations')).toBe('android-technical-limitations');
    expect(slugifySegment('DESIGN.md')).toBe('design-md');
    expect(slugifySegment('Help and Feedback')).toBe('help-and-feedback');
    expect(slugifySegment('iOS - iPadOS Kit')).toBe('ios-ipados-kit');
    expect(slugifySegment('T1')).toBe('t1');
    expect(slugifySegment('AI & LLMs')).toBe('ai-llms');
  });
});

describe('slugifyTitle', () => {
  it('slugifies every segment and drops empty ones', () => {
    expect(slugifyTitle('Design Tokens/T1/Color')).toEqual(['design-tokens', 't1', 'color']);
    expect(slugifyTitle('Welcome')).toEqual(['welcome']);
  });
});

describe('buildOutputPath', () => {
  it('builds the llms output path', () => {
    expect(buildOutputPath(['design-tokens', 't1', 'color'])).toBe(
      'llms/design-tokens/t1/color.md',
    );
  });
});

describe('groupEntriesByTitle', () => {
  it('groups docs and story entries by title', () => {
    const groups = groupEntriesByTitle([
      entry({ id: 'b--docs', title: 'Components/Button' }),
      entry({ id: 'b--one', title: 'Components/Button', type: 'story' }),
      entry({ id: 'b--two', title: 'Components/Button', type: 'story' }),
      entry({ id: 'w--docs', title: 'Welcome' }),
      entry({ id: 'x--docs', title: '' }),
    ]);
    expect(groups).toEqual([
      {
        title: 'Components/Button',
        docsEntry: entry({ id: 'b--docs', title: 'Components/Button' }),
        storyEntries: [
          entry({ id: 'b--one', title: 'Components/Button', type: 'story' }),
          entry({ id: 'b--two', title: 'Components/Button', type: 'story' }),
        ],
      },
      { title: 'Welcome', docsEntry: entry({ id: 'w--docs', title: 'Welcome' }), storyEntries: [] },
    ]);
  });
});

describe('orderTitleGroups', () => {
  it('orders known categories with AI & LLMs between Typography and Components', () => {
    const groups = [
      group('Zeta/Page'),
      group('Alpha/Page'),
      group('Components/Button'),
      group('Typography'),
      group('AI & LLMs'),
      group('Icons/Getting Started'),
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
      'Alpha/Page',
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

  it('does not mutate the input', () => {
    const groups = [group('Components/Button'), group('Welcome')];
    const snapshot = [...groups];
    orderTitleGroups(groups);
    expect(groups).toEqual(snapshot);
  });
});
