import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { cleanMdxContent, extractRawMdImports } from './raw-md.ts';

const FIXTURES_DIRECTORY: string = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__');

function readFixture(fixtureName: string): string {
  return readFileSync(join(FIXTURES_DIRECTORY, fixtureName), 'utf8');
}

describe('extractRawMdImports', () => {
  it('extracts the raw md import of a token shell mdx with the ?raw suffix stripped', () => {
    expect(extractRawMdImports(readFixture('token-shell.mdx'))).toEqual([
      { identifier: 'T2ColorMarkdown', importPath: '../../assets/t2-color.md' },
    ]);
  });

  it('extracts every raw md import when an mdx page declares several', () => {
    expect(extractRawMdImports(readFixture('multi-raw.mdx'))).toEqual([
      { identifier: 'TokensChangelog', importPath: '../assets/tokens-changelog.md' },
      { identifier: 'ComponentsChangelog', importPath: '../assets/components-changelog.md' },
    ]);
  });

  it('returns an empty array when the mdx page declares no raw md import', () => {
    expect(extractRawMdImports(readFixture('prose-guide.mdx'))).toEqual([]);
  });

  it('matches raw md imports with or without a trailing semicolon', () => {
    expect(extractRawMdImports("import A from './a.md?raw'\nimport B from './b.md?raw';")).toEqual([
      { identifier: 'A', importPath: './a.md' },
      { identifier: 'B', importPath: './b.md' },
    ]);
  });

  it('ignores raw imports that are not markdown assets', () => {
    expect(extractRawMdImports("import styles from './welcome.css?raw';")).toEqual([]);
  });
});

describe('cleanMdxContent', () => {
  it('substitutes the resolved raw md into a token shell and strips imports and Meta', () => {
    const resolved = new Map([['T2ColorMarkdown', readFixture('t2-color.md')]]);
    expect(cleanMdxContent(readFixture('token-shell.mdx'), resolved)).toBe(
      [
        '# T2 Color Tokens',
        '',
        'T2 Color tokens provide semantic color definitions for backgrounds, text, borders, and interactive states. Use the toolbar selectors above to switch between products and themes.',
        '',
        readFixture('t2-color.md').trimEnd(),
      ].join('\n'),
    );
  });

  it('strips the import and Meta from a prose mdx page while keeping the rest untouched', () => {
    expect(cleanMdxContent(readFixture('prose-guide.mdx'), new Map())).toBe(
      [
        '## Installation',
        '',
        '```bash',
        'npm install @infomaniak-design-system/components',
        '```',
        '',
        "Import and register the components you need. **Call `define()` in your application's entry file** so custom elements are defined before we try to render them:",
        '',
        '```html',
        '<esds-icon name="esds:headset"></esds-icon>',
        '```',
        '',
        "> Each component may have additional configuration. See the component's documentation for specifics.",
      ].join('\n'),
    );
  });

  it('strips named and bare imports and Meta from a JSX-heavy mdx while keeping all other JSX untouched', () => {
    expect(cleanMdxContent(readFixture('welcome-jsx.mdx'), new Map())).toBe(
      [
        '<div className="welcome-container">',
        '  <div className="welcome-hero">',
        '    <h1>Infomaniak Design System</h1>',
        '    <p className="welcome-subtitle">',
        '      A comprehensive design system powering Infomaniak products.',
        '    </p>',
        '  </div>',
        '',
        '<div className="welcome-section">',
        '  <h2>Explore the Design System</h2>',
        '  <div className="card-grid">',
        '    <a',
        '      href="./?path=/docs/design-tokens-getting-started--docs"',
        '      className="card card--vertical"',
        '    >',
        '      <h3 className="card__title">Design Tokens</h3>',
        '',
        '      <span className="card__link">Explore tokens →</span>',
        '    </a>',
        '',
        '  </div>',
        '</div>',
        '',
        '</div>',
      ].join('\n'),
    );
  });

  it('substitutes DocsMarkdown tags with surrounding whitespace inside the braces', () => {
    expect(
      cleanMdxContent('<DocsMarkdown>{ A }</DocsMarkdown>', new Map([['A', 'content A']])),
    ).toBe('content A');
  });

  it('substitutes DocsMarkdown tags spanning multiple lines', () => {
    expect(
      cleanMdxContent('<DocsMarkdown>\n  {A}\n</DocsMarkdown>', new Map([['A', 'content A']])),
    ).toBe('content A');
  });

  it('normalizes whitespace-only lines and collapses runs of blank lines', () => {
    expect(cleanMdxContent('# Title\n  \n  \nBody', new Map())).toBe('# Title\n\nBody');
  });

  it('substitutes every resolved raw md with DocsMarkdown tag variants', () => {
    const resolved = new Map([
      ['TokensChangelog', readFixture('tokens-changelog.md')],
      ['ComponentsChangelog', readFixture('components-changelog.md')],
    ]);
    expect(cleanMdxContent(readFixture('multi-raw.mdx'), resolved)).toBe(
      [
        '# @infomaniak-design-system/tokens',
        '',
        '## 1.2.0',
        '',
        '- Added T2 text tokens.',
        '',
        '# @infomaniak-design-system/components',
        '',
        '## 2.1.0',
        '',
        '- Fixed tooltip display when price contains `$1.99`.',
        '- Escaped special characters (`$&`) in markdown output.',
        '- Added `esds-separator`.',
      ].join('\n'),
    );
  });

  it('leaves DocsMarkdown placeholders untouched when their identifier is not resolved', () => {
    expect(cleanMdxContent(readFixture('token-shell.mdx'), new Map())).toBe(
      [
        '# T2 Color Tokens',
        '',
        'T2 Color tokens provide semantic color definitions for backgrounds, text, borders, and interactive states. Use the toolbar selectors above to switch between products and themes.',
        '',
        '<DocsMarkdown>{T2ColorMarkdown}</DocsMarkdown>',
      ].join('\n'),
    );
  });

  it('resolves a changelog shell mdx with its raw changelog content', () => {
    const resolved = new Map([['TokensChangelog', readFixture('tokens-changelog.md')]]);
    expect(cleanMdxContent(readFixture('changelog-shell.mdx'), resolved)).toBe(
      [
        '# @infomaniak-design-system/tokens',
        '',
        '# @infomaniak-design-system/tokens',
        '',
        '## 1.2.0',
        '',
        '- Added T2 text tokens.',
      ].join('\n'),
    );
  });

  it('substitutes every occurrence of the same identifier', () => {
    expect(
      cleanMdxContent(
        '<DocsMarkdown>{A}</DocsMarkdown>\n\n<DocsMarkdown>{A}</DocsMarkdown>',
        new Map([['A', 'x']]),
      ),
    ).toBe('x\n\nx');
  });
});
