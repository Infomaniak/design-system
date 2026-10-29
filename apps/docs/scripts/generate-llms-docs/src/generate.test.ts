import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateLlmsDocs, type FileSystemDeps } from './generate.ts';

const APPS_DOCS_DIR = '/repo/apps/docs';
const DIST_DIR = join(APPS_DOCS_DIR, 'storybook-static');

const MINI_CEM = JSON.stringify({
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
});

const MINI_INDEX = {
  v: 5,
  entries: {
    'welcome--docs': {
      id: 'welcome--docs',
      title: 'Welcome',
      name: 'Docs',
      importPath: './src/stories/welcome.mdx',
      type: 'docs',
      tags: ['dev'],
    },
    'ai-llms--docs': {
      id: 'ai-llms--docs',
      title: 'AI & LLMs',
      name: 'Docs',
      importPath: './src/stories/ai-llms.mdx',
      type: 'docs',
      tags: ['dev'],
    },
    'components-separator--docs': {
      id: 'components-separator--docs',
      title: 'Components/Separator',
      name: 'Docs',
      importPath:
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      type: 'docs',
      tags: ['dev'],
    },
    'components-changelog--docs': {
      id: 'components-changelog--docs',
      title: 'Components/CHANGELOG',
      name: 'Docs',
      importPath: './src/stories/components/changelog.mdx',
      type: 'docs',
      tags: ['dev'],
    },
  },
};

const WELCOME_MDX = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  '',
  '<Meta title="Welcome" />',
  '',
  '# Welcome',
  '',
  'The Infomaniak Design System documentation.',
].join('\n');

const WELCOME_MDX_WITH_PROSE_LINK = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  '',
  '<Meta title="Welcome" />',
  '',
  '# Welcome',
  '',
  'Ask [questions](mailto:support@infomaniak.ch) or jump to [styles](#styles).',
].join('\n');

const CHANGELOG_MDX = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  "import ChangelogMarkdown from '../assets/components-changelog.md?raw';",
  '',
  '<Meta title="Components/CHANGELOG" />',
  '',
  '<DocsMarkdown>{ChangelogMarkdown}</DocsMarkdown>',
].join('\n');

const CHANGELOG_MD = ['# Changelog', '', '- 0.5.1: initial release.'].join('\n');

const AI_LLMS_MDX = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  '',
  '<Meta title="AI & LLMs" />',
  '',
  '# AI & LLMs',
  '',
  'Machine-readable resources for AI agents:',
  '',
  '- [llms.txt](./llms.txt) — the index.',
  '- [llms-full.txt](./llms-full.txt) — the full docs.',
  '- [DESIGN.md](./DESIGN.md) — the token reference.',
].join('\n');

const SEPARATOR_STORIES = [
  "import documentation from './esds-separator.component.md?raw';",
  '',
  "const meta = { component: 'esds-separator' } satisfies Meta;",
  '',
  'export const Default: Story = {};',
].join('\n');

const SEPARATOR_MD =
  'Import and register the separator component with `EsdsSeparatorComponent.define();`.';

function createDeps(inputFiles: Record<string, string>): {
  deps: FileSystemDeps;
  outputs: Map<string, string>;
} {
  const outputs = new Map<string, string>();
  const files = new Map<string, string>(Object.entries(inputFiles));
  return {
    outputs,
    deps: {
      readFile: (path) => {
        const content = outputs.get(path) ?? files.get(path);
        if (content === undefined) throw new Error(`File not found: ${path}`);
        return content;
      },
      writeFile: (path, content) => {
        outputs.set(path, content);
      },
      mkdir: () => undefined,
    },
  };
}

function createInputFiles(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    [join(DIST_DIR, 'index.json')]: JSON.stringify(MINI_INDEX),
    [join(DIST_DIR, 'DESIGN.md')]: '# DESIGN.md\n\nToken reference.',
    [join(APPS_DOCS_DIR, 'public/DESIGN.md')]: '# DESIGN.md\n\nToken reference.',
    [join(APPS_DOCS_DIR, 'src/stories/welcome.mdx')]: WELCOME_MDX,
    [join(APPS_DOCS_DIR, 'src/stories/ai-llms.mdx')]: AI_LLMS_MDX,
    [join(APPS_DOCS_DIR, 'src/stories/components/changelog.mdx')]: CHANGELOG_MDX,
    [join(APPS_DOCS_DIR, 'src/stories/assets/components-changelog.md')]: CHANGELOG_MD,
    [join(
      APPS_DOCS_DIR,
      '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
    )]: SEPARATOR_STORIES,
    [join(
      APPS_DOCS_DIR,
      '../../packages/components/src/components/esds-separator/esds-separator.component.md',
    )]: SEPARATOR_MD,
    [join(APPS_DOCS_DIR, '../../packages/components/custom-elements.json')]: MINI_CEM,
    ...overrides,
  };
}

const BASE_OPTIONS = {
  distDir: DIST_DIR,
  appsDocsDir: APPS_DOCS_DIR,
  componentsDir: join(APPS_DOCS_DIR, '../../packages/components'),
  designMdPath: join(APPS_DOCS_DIR, 'public/DESIGN.md'),
  baseUrl: '',
};

describe('generateLlmsDocs', () => {
  it('generates all pages, llms.txt and llms-full.txt', () => {
    const { deps, outputs } = createDeps(createInputFiles());
    const result = generateLlmsDocs(BASE_OPTIONS, deps);
    expect(result.pageCount).toBe(4);
    expect(result.fileCount).toBe(6);
    expect(outputs.has(join(DIST_DIR, 'llms/welcome.md'))).toBe(true);
    expect(outputs.has(join(DIST_DIR, 'llms/ai-llms.md'))).toBe(true);
    expect(outputs.has(join(DIST_DIR, 'llms/components/separator.md'))).toBe(true);
    expect(outputs.has(join(DIST_DIR, 'llms/components/changelog.md'))).toBe(true);
    expect(outputs.has(join(DIST_DIR, 'llms-full.txt'))).toBe(true);
    expect(outputs.has(join(DIST_DIR, 'llms.txt'))).toBe(true);

    const separatorPage = outputs.get(join(DIST_DIR, 'llms/components/separator.md')) ?? '';
    expect(separatorPage).toContain('# Components/Separator');
    expect(separatorPage).toContain('### Default');
    expect(separatorPage).toContain('<esds-separator></esds-separator>');

    const llmsTxt = outputs.get(join(DIST_DIR, 'llms.txt')) ?? '';
    expect(llmsTxt).toContain('## Welcome');
    expect(llmsTxt).toContain('## Components');
    expect(llmsTxt).toContain('## Optional');
    expect(llmsTxt).toContain('- [Components/CHANGELOG](llms/components/changelog.md)');
    expect(llmsTxt).toContain('(DESIGN.md)');
    expect([...llmsTxt].every((char) => char.charCodeAt(0) <= 0x7f)).toBe(true);

    const llmsFull = outputs.get(join(DIST_DIR, 'llms-full.txt')) ?? '';
    expect(llmsFull.startsWith('# DESIGN.md')).toBe(true);
    expect(llmsFull).toContain('# Components/CHANGELOG');
  });

  it('rewrites storybook links to the generated pages', () => {
    const welcomeMdx = [
      "import { Meta } from '@storybook/addon-docs/blocks';",
      '',
      '<Meta title="Welcome" />',
      '',
      '# Welcome',
      '',
      'Read [the AI resources](./?path=/docs/ai-llms--docs) or the [changelog](./?path=/docs/components-changelog--docs).',
    ].join('\n');
    const { deps, outputs } = createDeps(
      createInputFiles({ [join(APPS_DOCS_DIR, 'src/stories/welcome.mdx')]: welcomeMdx }),
    );
    generateLlmsDocs(BASE_OPTIONS, deps);
    const page = outputs.get(join(DIST_DIR, 'llms/welcome.md')) ?? '';
    expect(page).toContain('[the AI resources](ai-llms.md)');
    expect(page).toContain('[changelog](components/changelog.md)');
    const llmsFull = outputs.get(join(DIST_DIR, 'llms-full.txt')) ?? '';
    expect(llmsFull).toContain('[the AI resources](ai-llms.md)');
  });

  it('throws when a validated target is missing from the dist directory', () => {
    const inputs = createInputFiles();
    delete inputs[join(DIST_DIR, 'DESIGN.md')];
    const { deps } = createDeps(inputs);
    expect(() => generateLlmsDocs(BASE_OPTIONS, deps)).toThrow(
      'Missing llms.txt target: DESIGN.md',
    );
  });

  it('keeps prose links in summaries without resolving them as file paths', () => {
    const inputs = createInputFiles({
      [join(APPS_DOCS_DIR, 'src/stories/welcome.mdx')]: WELCOME_MDX_WITH_PROSE_LINK,
    });
    const { deps, outputs } = createDeps(inputs);
    expect(() => generateLlmsDocs(BASE_OPTIONS, deps)).not.toThrow();
    const llmsTxt = outputs.get(join(DIST_DIR, 'llms.txt')) ?? '';
    expect(llmsTxt).toContain('[questions](mailto:support@infomaniak.ch)');
    expect(llmsTxt).toContain('[styles](#styles)');
  });

  it('omits the DESIGN.md optional link when the source file is unavailable', () => {
    const inputs = createInputFiles();
    delete inputs[join(APPS_DOCS_DIR, 'public/DESIGN.md')];
    const { deps, outputs } = createDeps(inputs);
    generateLlmsDocs(BASE_OPTIONS, deps);
    const llmsTxt = outputs.get(join(DIST_DIR, 'llms.txt')) ?? '';
    expect(llmsTxt).not.toContain('(DESIGN.md)');
    const llmsFull = outputs.get(join(DIST_DIR, 'llms-full.txt')) ?? '';
    expect(llmsFull.startsWith('# Welcome')).toBe(true);
  });

  it('generates absolute links with a base url', () => {
    const { deps, outputs } = createDeps(createInputFiles());
    generateLlmsDocs({ ...BASE_OPTIONS, baseUrl: 'https://example.com/base/' }, deps);
    const llmsTxt = outputs.get(join(DIST_DIR, 'llms.txt')) ?? '';
    expect(llmsTxt).toContain('(https://example.com/base/llms/welcome.md)');
    expect(llmsTxt).toContain('(https://example.com/base/llms-full.txt)');
  });

  it('re-anchors root file links on generated pages, not in llms-full.txt', () => {
    const { deps, outputs } = createDeps(createInputFiles());
    generateLlmsDocs(BASE_OPTIONS, deps);
    const page = outputs.get(join(DIST_DIR, 'llms/ai-llms.md')) ?? '';
    expect(page).toContain('](../llms.txt)');
    expect(page).toContain('](../llms-full.txt)');
    expect(page).toContain('](../DESIGN.md)');
    const llmsFull = outputs.get(join(DIST_DIR, 'llms-full.txt')) ?? '';
    expect(llmsFull).toContain('(./llms.txt)');
    expect(llmsFull).toContain('(./DESIGN.md)');
  });

  it('mirrors the root files to the public dir when provided', () => {
    const { deps, outputs } = createDeps(createInputFiles());
    const publicDir = join(APPS_DOCS_DIR, 'public');
    const result = generateLlmsDocs({ ...BASE_OPTIONS, publicDir }, deps);
    expect(result.fileCount).toBe(6);
    expect(outputs.get(join(publicDir, 'llms.txt'))).toBe(outputs.get(join(DIST_DIR, 'llms.txt')));
    expect(outputs.get(join(publicDir, 'llms-full.txt'))).toBe(
      outputs.get(join(DIST_DIR, 'llms-full.txt')),
    );
  });
});
