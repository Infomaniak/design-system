import { describe, expect, it } from 'vitest';
import { cleanMdxContent, extractRawMdImports, transformOutsideFences } from './raw-md.ts';

const TOKEN_SHELL = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  "import ColorMarkdown from '../../assets/t2-color.md?raw';",
  "import DocsMarkdown from '../../../components/docs-markdown.tsx';",
  '',
  "<Meta title='Design Tokens/T2/Color' />",
  '',
  '# T2 Color Tokens',
  '',
  'Semantic colors.',
  '',
  '<DocsMarkdown>{ColorMarkdown}</DocsMarkdown>',
].join('\n');

describe('extractRawMdImports', () => {
  it('extracts markdown raw imports without the ?raw suffix', () => {
    expect(extractRawMdImports(TOKEN_SHELL)).toEqual([
      { identifier: 'ColorMarkdown', importPath: '../../assets/t2-color.md' },
    ]);
  });

  it('returns an empty list without raw imports', () => {
    expect(extractRawMdImports('# Just prose')).toEqual([]);
  });
});

describe('cleanMdxContent', () => {
  it('substitutes raw markdown and strips imports and Meta', () => {
    const resolved = new Map([['ColorMarkdown', 'Real token content.\n\n```html\n<x></x>\n```']]);
    expect(cleanMdxContent(TOKEN_SHELL, resolved)).toBe(
      '# T2 Color Tokens\n\nSemantic colors.\n\nReal token content.\n\n```html\n<x></x>\n```',
    );
  });

  it('keeps non-shell jsx content as-is', () => {
    const mdx = [
      "import { Meta } from '@storybook/addon-docs/blocks';",
      '',
      '<Meta title="Welcome" />',
      '',
      '<div className="welcome-container">',
      '  <h1>Hello</h1>',
      '</div>',
    ].join('\n');
    expect(cleanMdxContent(mdx, new Map())).toBe(
      '<div className="welcome-container">\n  <h1>Hello</h1>\n</div>',
    );
  });

  it('collapses excessive blank lines', () => {
    expect(cleanMdxContent('a\n\n\n\n\nb', new Map())).toBe('a\n\nb');
  });

  it('keeps import statements inside fenced code blocks', () => {
    const mdx = [
      "import { Meta } from '@storybook/addon-docs/blocks';",
      '',
      '<Meta title="Components/Getting Started" />',
      '',
      '```ts',
      "import { EsdsIconComponent } from '@infomaniak-design-system/components';",
      '',
      'EsdsIconComponent.define();',
      '```',
    ].join('\n');
    expect(cleanMdxContent(mdx, new Map())).toBe(
      [
        '```ts',
        "import { EsdsIconComponent } from '@infomaniak-design-system/components';",
        '',
        'EsdsIconComponent.define();',
        '```',
      ].join('\n'),
    );
  });

  it('does not close a fence on a shorter marker line', () => {
    const mdx = [
      '````md',
      '```ts',
      "import { EsdsIconComponent } from '@infomaniak-design-system/components';",
      '```',
      '````',
    ].join('\n');
    expect(cleanMdxContent(mdx, new Map())).toBe(mdx);
  });
});

describe('transformOutsideFences', () => {
  it('transforms prose runs and leaves fenced blocks untouched', () => {
    const source = ['before', '', '```js', 'import x', '```', 'after'].join('\n');
    expect(transformOutsideFences(source, (text) => text.toUpperCase())).toBe(
      ['BEFORE', '', '```js', 'import x', '```', 'AFTER'].join('\n'),
    );
  });

  it('leaves an unterminated fence untouched until the end', () => {
    const source = ['before', '', '```js', 'still fenced'].join('\n');
    expect(transformOutsideFences(source, (text) => text.toUpperCase())).toBe(
      ['BEFORE', '', '```js', 'still fenced'].join('\n'),
    );
  });

  it('handles adjacent fences without prose between them', () => {
    const source = ['```js', 'x', '```', '```js', 'y', '```'].join('\n');
    expect(transformOutsideFences(source, (text) => text.toUpperCase())).toBe(source);
  });
});
