import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseCem } from './cem.ts';
import {
  buildPageModel,
  extractSummary,
  renderPageMarkdown,
  toArgsValue,
} from './page-renderer.ts';
import type { IndexEntry, PageModel, TitleGroup } from './types.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(currentDir, '__fixtures__');
const repositoryRoot = join(currentDir, '..', '..', '..', '..', '..');

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), 'utf8');
}

const realCem = parseCem(
  readFileSync(join(repositoryRoot, 'packages/components/custom-elements.json'), 'utf8'),
);

function createFiles(entries: Record<string, string>) {
  return (path: string): string => {
    const content = entries[path];
    if (content === undefined) throw new Error(`File not found: ${path}`);
    return content;
  };
}

function docsGroup(title: string, importPath: string): TitleGroup {
  const docsEntry: IndexEntry = {
    id: 'id',
    title,
    name: 'Docs',
    importPath,
    type: 'docs',
    tags: ['dev'],
  };
  return { title, docsEntry, storyEntries: [] };
}

const appsDocsDir = '/repo/apps/docs';

describe('buildPageModel', () => {
  it('builds a token page from an mdx shell', () => {
    const files = createFiles({
      [join(appsDocsDir, 'src/stories/tokens/t2/color.mdx')]: [
        "import { Meta } from '@storybook/addon-docs/blocks';",
        "import ColorMarkdown from '../../assets/t2-color.md?raw';",
        "import DocsMarkdown from '../../../components/docs-markdown.tsx';",
        '',
        "<Meta title='Design Tokens/T2/Color' />",
        '',
        '# T2 Color Tokens',
        '',
        'Semantic colors for backgrounds and text.',
        '',
        '<DocsMarkdown>{ColorMarkdown}</DocsMarkdown>',
      ].join('\n'),
      [join(appsDocsDir, 'src/stories/assets/t2-color.md')]: [
        '<!-- Do not edit directly, this file was auto-generated. -->',
        '',
        'Semantic colors.',
        '',
        '```html',
        '<esds-separator></esds-separator>',
        '```',
      ].join('\n'),
    });
    const page = buildPageModel({
      group: docsGroup('Design Tokens/T2/Color', './src/stories/tokens/t2/color.mdx'),
      cem: realCem,
      sources: { readFile: files, appsDocsDir },
    });
    expect(page.outputPath).toBe('llms/design-tokens/t2/color.md');
    expect(page.category).toBe('Design Tokens');
    expect(page.prose).toBe(
      'Semantic colors for backgrounds and text.\n\n<!-- Do not edit directly, this file was auto-generated. -->\n\nSemantic colors.\n\n```html\n<esds-separator></esds-separator>\n```',
    );
    expect(page.summary).toBe('Semantic colors for backgrounds and text.');
    expect(page.importSection).toBe('');
    expect(page.props).toBe('');
    expect(page.examples).toEqual([]);
  });

  it('builds a component page from autodocs stories', () => {
    const storiesPath = join(
      appsDocsDir,
      '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
    );
    const files = createFiles({
      [storiesPath]: readFixture('separator.component.stories.txt'),
      [join(
        appsDocsDir,
        '../../packages/components/src/components/esds-separator/esds-separator.component.md',
      )]: readFixture('separator.component.md'),
    });
    const page = buildPageModel({
      group: docsGroup(
        'Components/Separator',
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      ),
      cem: realCem,
      sources: { readFile: files, appsDocsDir },
    });
    expect(page.outputPath).toBe('llms/components/separator.md');
    expect(page.prose).toContain('Import and register the separator component');
    expect(page.prose).not.toMatch(/^# /);
    expect(page.importSection).toBe('');
    expect(page.props).toContain('### Attributes');
    expect(page.props).toContain('orientation');
    expect(page.summary.startsWith('Import and register the separator')).toBe(true);
    expect(page.examples.map((snippet) => snippet.code)).toEqual([
      '<esds-separator></esds-separator>',
      '<esds-separator orientation="vertical"></esds-separator>',
      '<esds-separator decorative></esds-separator>',
    ]);
  });

  it('synthesizes an import section when prose lacks the define pattern', () => {
    const storiesPath = join(
      appsDocsDir,
      '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
    );
    const prose = readFixture('separator.component.md').replace(
      /EsdsSeparatorComponent\.define\(\);/,
      '',
    );
    const files = createFiles({
      [storiesPath]: readFixture('separator.component.stories.txt'),
      [join(
        appsDocsDir,
        '../../packages/components/src/components/esds-separator/esds-separator.component.md',
      )]: prose,
    });
    const page = buildPageModel({
      group: docsGroup(
        'Components/Separator',
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      ),
      cem: realCem,
      sources: { readFile: files, appsDocsDir },
    });
    expect(page.importSection).toBe(
      "import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';\n\nEsdsSeparatorComponent.define();",
    );
  });

  it('builds an empty page for a group without a docs entry', () => {
    const page = buildPageModel({
      group: { title: 'Components/Orphan', storyEntries: [] },
      cem: realCem,
      sources: { readFile: createFiles({}), appsDocsDir },
    });
    expect(page.title).toBe('Components/Orphan');
    expect(page.prose).toBe('');
    expect(page.summary).toBe('');
    expect(page.importSection).toBe('');
    expect(page.props).toBe('');
    expect(page.examples).toEqual([]);
  });

  it('builds empty prose when stories lack a companion markdown import', () => {
    const storiesPath = join(
      appsDocsDir,
      '../../packages/components/src/components/esds-getting-started/esds-getting-started.stories.ts',
    );
    const page = buildPageModel({
      group: docsGroup(
        'Icons/Getting Started',
        '../../packages/components/src/components/esds-getting-started/esds-getting-started.stories.ts',
      ),
      cem: realCem,
      sources: {
        readFile: createFiles({ [storiesPath]: readFixture('plain-stories.txt') }),
        appsDocsDir,
      },
    });
    expect(page.prose).toBe('');
    expect(page.summary).toBe('');
    expect(page.examples).toEqual([]);
  });

  it('builds cem defaults from attributes with and without defaults', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
          {
            path: 'src/components/esds-widget/esds-widget.component.ts',
            declarations: [
              {
                name: 'EsdsWidgetComponent',
                tagName: 'esds-widget',
                customElement: true,
                attributes: [{ name: 'withoutDefault' }, { name: 'withDefault', default: 'true' }],
              },
            ],
          },
        ],
      }),
    );
    const storiesPath = join(
      appsDocsDir,
      '../../packages/components/src/components/esds-widget/esds-widget.component.stories.ts',
    );
    const widgetStories = readFixture('plain-stories.txt')
      .replaceAll('Icons/Getting Started', 'Components/Widget')
      .replace(
        "title: 'Components/Widget',",
        "title: 'Components/Widget',\n  component: 'esds-widget',",
      );
    const page = buildPageModel({
      group: docsGroup(
        'Components/Widget',
        '../../packages/components/src/components/esds-widget/esds-widget.component.stories.ts',
      ),
      cem,
      sources: { readFile: createFiles({ [storiesPath]: widgetStories }), appsDocsDir },
    });
    expect(page.examples).toEqual([
      {
        name: 'Getting Started',
        description: undefined,
        code: '<p>Getting started with icons.</p>',
      },
    ]);
  });
});

describe('extractSummary', () => {
  it('returns the first plain paragraph', () => {
    expect(extractSummary('## Setup\n\nFirst paragraph here.\n\nSecond one.')).toBe(
      'First paragraph here.',
    );
  });

  it('skips headings, lists, blockquotes, tables and html', () => {
    expect(extractSummary('- item\n\nReal text.')).toBe('Real text.');
    expect(extractSummary('> quote\n\nReal text.')).toBe('Real text.');
    expect(extractSummary('| a | b |\n\nReal text.')).toBe('Real text.');
    expect(extractSummary('<div>x</div>\n\nReal text.')).toBe('Real text.');
  });

  it('ignores fenced code blocks', () => {
    expect(extractSummary('```\ncode\n```\n\nReal text.')).toBe('Real text.');
  });

  it('truncates long summaries with an ellipsis', () => {
    const long = 'a'.repeat(200);
    const summary = extractSummary(long);
    expect(summary.length).toBe(120);
    expect(summary.endsWith('…')).toBe(true);
  });

  it('stops at a structure line directly after a paragraph', () => {
    expect(extractSummary('First line.\n## Section\n\nMore.')).toBe('First line.');
  });

  it('skips raw html lines such as generated token tables', () => {
    expect(
      extractSummary('CSS: <button class="token-value">var(--x)</button>\n\n<table>\n</table>'),
    ).toBe('');
  });

  it('returns empty for prose without a plain paragraph', () => {
    expect(extractSummary('# Only a heading')).toBe('');
  });
});

describe('toArgsValue', () => {
  it('unquotes single and double quoted defaults', () => {
    expect(toArgsValue("'horizontal'")).toBe('horizontal');
    expect(toArgsValue('"vertical"')).toBe('vertical');
  });

  it('converts boolean and numeric defaults', () => {
    expect(toArgsValue('true')).toBe(true);
    expect(toArgsValue('false')).toBe(false);
    expect(toArgsValue('42')).toBe(42);
    expect(toArgsValue('-1.5')).toBe(-1.5);
  });

  it('keeps unquoted strings as-is', () => {
    expect(toArgsValue('horizontal')).toBe('horizontal');
  });
});

describe('renderPageMarkdown', () => {
  it('renders all sections in order', () => {
    const page: PageModel = {
      title: 'Components/Separator',
      category: 'Components',
      slugParts: ['components', 'separator'],
      outputPath: 'llms/components/separator.md',
      summary: 'A separator.',
      prose: '## Usage\n\nHTML here.',
      importSection: "import { X } from 'pkg';",
      props:
        '## API\n\n### Attributes\n\n| Name | Type | Default | Required | Description |\n| :--- | :--- | :--- | :--- | :--- |',
      examples: [
        { name: 'Default', code: '<esds-separator></esds-separator>' },
        {
          name: 'Vertical',
          description: 'Vertical variant.',
          code: '<esds-separator orientation="vertical"></esds-separator>',
        },
      ],
    };
    const markdown = renderPageMarkdown(page);
    expect(markdown).toBe(
      [
        '# Components/Separator',
        '',
        '> A separator.',
        '',
        '## Import',
        '',
        '```ts',
        "import { X } from 'pkg';",
        '```',
        '',
        '## Usage',
        '',
        'HTML here.',
        '',
        '## API',
        '',
        '### Attributes',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '',
        '## Examples',
        '',
        '### Default',
        '',
        '```html',
        '<esds-separator></esds-separator>',
        '```',
        '',
        '### Vertical',
        '',
        'Vertical variant.',
        '',
        '```html',
        '<esds-separator orientation="vertical"></esds-separator>',
        '```',
      ].join('\n') + '\n',
    );
  });

  it('renders a minimal page with only a title', () => {
    const page: PageModel = {
      title: 'Welcome',
      category: 'Welcome',
      slugParts: ['welcome'],
      outputPath: 'llms/welcome.md',
      summary: '',
      prose: '',
      importSection: '',
      props: '',
      examples: [],
    };
    expect(renderPageMarkdown(page)).toBe('# Welcome\n');
  });
});
