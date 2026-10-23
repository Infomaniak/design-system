import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseCem } from './cem.ts';
import {
  buildPageModel,
  extractSummary,
  renderPageMarkdown,
  toArgsValue,
} from './page-renderer.ts';
import type { IndexEntry, PageModel, TitleGroup } from './types.ts';

const APPS_DOCS_DIR = '/repo/apps/docs';

const CEM = parseCem(
  JSON.stringify({
    modules: [
      {
        path: 'src/components/esds-separator/esds-separator.component.ts',
        declarations: [
          {
            name: 'EsdsSeparatorComponent',
            tagName: 'esds-separator',
            customElement: true,
            attributes: [{ name: 'decorative', type: { text: 'boolean' }, default: 'false' }],
          },
        ],
      },
    ],
  }),
);

const SEPARATOR_STORIES = [
  "import documentation from './esds-separator.component.md?raw';",
  '',
  "const meta = { component: 'esds-separator' } satisfies Meta;",
  '',
  'export const Default: Story = {};',
].join('\n');

const SEPARATOR_MD = [
  '- [Figma](https://figma.com/x)',
  '',
  '## Setup',
  '',
  'Import and register the separator component:',
  '',
  '```ts',
  'EsdsSeparatorComponent.define();',
  '```',
].join('\n');

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

describe('buildPageModel', () => {
  it('builds a token page from an mdx shell', () => {
    const files = createFiles({
      [join(APPS_DOCS_DIR, 'src/stories/tokens/t2/color.mdx')]: [
        "import { Meta } from '@storybook/addon-docs/blocks';",
        "import ColorMarkdown from '../../assets/t2-color.md?raw';",
        '',
        "<Meta title='Design Tokens/T2/Color' />",
        '',
        '# T2 Color Tokens',
        '',
        '<DocsMarkdown>{ColorMarkdown}</DocsMarkdown>',
      ].join('\n'),
      [join(APPS_DOCS_DIR, 'src/stories/assets/t2-color.md')]: 'Semantic colors.',
    });
    const page = buildPageModel({
      group: docsGroup('Design Tokens/T2/Color', './src/stories/tokens/t2/color.mdx'),
      cem: CEM,
      sources: { readFile: files, appsDocsDir: APPS_DOCS_DIR },
    });
    expect(page.outputPath).toBe('llms/design-tokens/t2/color.md');
    expect(page.prose).toBe('Semantic colors.');
    expect(page.summary).toBe('Semantic colors.');
    expect(page.importSection).toBe('');
    expect(page.props).toBe('');
    expect(page.examples).toEqual([]);
  });

  it('builds a component page from autodocs stories', () => {
    const storiesPath = join(
      APPS_DOCS_DIR,
      '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
    );
    const files = createFiles({
      [storiesPath]: SEPARATOR_STORIES,
      [join(
        APPS_DOCS_DIR,
        '../../packages/components/src/components/esds-separator/esds-separator.component.md',
      )]: SEPARATOR_MD,
    });
    const page = buildPageModel({
      group: docsGroup(
        'Components/Separator',
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      ),
      cem: CEM,
      sources: { readFile: files, appsDocsDir: APPS_DOCS_DIR },
    });
    expect(page.outputPath).toBe('llms/components/separator.md');
    expect(page.prose).toContain('Import and register the separator component');
    expect(page.importSection).toBe('');
    expect(page.props).toContain('| decorative |');
    expect(page.examples).toEqual([
      { name: 'Default', description: undefined, code: '<esds-separator></esds-separator>' },
    ]);
  });

  it('generates the import section when the prose lacks a define snippet', () => {
    const storiesPath = join(
      APPS_DOCS_DIR,
      '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
    );
    const files = createFiles({
      [storiesPath]: SEPARATOR_STORIES,
      [join(
        APPS_DOCS_DIR,
        '../../packages/components/src/components/esds-separator/esds-separator.component.md',
      )]: 'Separator prose without a define snippet.',
    });
    const page = buildPageModel({
      group: docsGroup(
        'Components/Separator',
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      ),
      cem: CEM,
      sources: { readFile: files, appsDocsDir: APPS_DOCS_DIR },
    });
    expect(page.importSection).toBe(
      "import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';\n\nEsdsSeparatorComponent.define();",
    );
  });

  it('builds an empty page for a group without a docs entry', () => {
    const page = buildPageModel({
      group: { title: 'Components/Orphan', storyEntries: [] },
      cem: CEM,
      sources: { readFile: createFiles({}), appsDocsDir: APPS_DOCS_DIR },
    });
    expect(page.prose).toBe('');
    expect(page.props).toBe('');
    expect(page.examples).toEqual([]);
  });
});

describe('toArgsValue', () => {
  it('converts cem default strings to primitives', () => {
    expect(toArgsValue("'horizontal'")).toBe('horizontal');
    expect(toArgsValue('false')).toBe(false);
    expect(toArgsValue('42')).toBe(42);
    expect(toArgsValue('horizontal')).toBe('horizontal');
  });
});

describe('extractSummary', () => {
  it('returns the first plain paragraph and skips structure and html', () => {
    expect(extractSummary('## Setup\n\nFirst paragraph here.\n\nSecond one.')).toBe(
      'First paragraph here.',
    );
    expect(extractSummary('CSS: <button>x</button>\n\nReal text.')).toBe('Real text.');
  });

  it('skips code fences while scanning for the summary', () => {
    expect(extractSummary('```ts\nEsdsSeparatorComponent.define();\n```\n\nAfter the fence.')).toBe(
      'After the fence.',
    );
  });

  it('truncates long summaries with an ellipsis', () => {
    const summary = extractSummary('a'.repeat(200));
    expect(summary.length).toBe(120);
    expect(summary.endsWith('…')).toBe(true);
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
      props: '## API',
      examples: [
        {
          name: 'Default',
          description: 'Vertical variant.',
          code: '<esds-separator></esds-separator>',
        },
      ],
    };
    expect(renderPageMarkdown(page)).toBe(
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
        '## Examples',
        '',
        '### Default',
        '',
        'Vertical variant.',
        '',
        '```html',
        '<esds-separator></esds-separator>',
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
