import { describe, expect, it } from 'vitest';
import { cleanMdxContent, extractRawMdImports } from './raw-md.ts';

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
});
