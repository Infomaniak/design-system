import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { generateLlmsDocs, type FileSystemDeps } from './generate.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(currentDir, '__fixtures__');
const repositoryRoot = join(currentDir, '..', '..', '..', '..', '..');

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), 'utf8');
}

const APPS_DOCS_DIR = '/repo/apps/docs';
const DIST_DIR = join(APPS_DOCS_DIR, 'storybook-static');

const MINI_INDEX = {
  v: 5,
  entries: {
    'welcome--docs': {
      id: 'welcome--docs',
      title: 'Welcome',
      name: 'Docs',
      importPath: './src/stories/welcome.mdx',
      type: 'docs',
      tags: ['dev', 'manifest', 'unattached-mdx'],
    },
    'design-tokens-t1-color--docs': {
      id: 'design-tokens-t1-color--docs',
      title: 'Design Tokens/T1/Color',
      name: 'Docs',
      importPath: './src/stories/tokens/t2/color.mdx',
      type: 'docs',
      tags: ['dev', 'manifest', 'unattached-mdx'],
    },
    'components-separator--docs': {
      id: 'components-separator--docs',
      title: 'Components/Separator',
      name: 'Docs',
      importPath:
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      type: 'docs',
      tags: ['dev', 'manifest', 'autodocs'],
    },
    'components-separator--default': {
      id: 'components-separator--default',
      title: 'Components/Separator',
      name: 'Default',
      importPath:
        '../../packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      type: 'story',
      subtype: 'story',
      exportName: 'Default',
      tags: ['dev', 'manifest', 'autodocs'],
    },
    'components-changelog--docs': {
      id: 'components-changelog--docs',
      title: 'Components/CHANGELOG',
      name: 'Docs',
      importPath: './src/stories/components/changelog.mdx',
      type: 'docs',
      tags: ['dev', 'manifest', 'unattached-mdx'],
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

const COLOR_MDX = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  "import ColorMarkdown from '../../assets/t1-color.md?raw';",
  "import DocsMarkdown from '../../../components/docs-markdown.tsx';",
  '',
  '<Meta title="Design Tokens/T1/Color" />',
  '',
  '# T1 Color Tokens',
  '',
  'Primitive color values.',
  '',
  '<DocsMarkdown>{ColorMarkdown}</DocsMarkdown>',
].join('\n');

const COLOR_MD = ['# T1 Color Tokens', '', 'Primitive colors.', '', 'Use CSS variables.'].join(
  '\n',
);

const CHANGELOG_MDX = [
  "import { Meta } from '@storybook/addon-docs/blocks';",
  "import ChangelogMarkdown from '../assets/components-changelog.md?raw';",
  "import DocsMarkdown from '../../../components/docs-markdown.tsx';",
  '',
  '<Meta title="Components/CHANGELOG" />',
  '',
  '<DocsMarkdown>{ChangelogMarkdown}</DocsMarkdown>',
].join('\n');

const CHANGELOG_MD = ['# Changelog', '', '- 0.5.1: initial release.'].join('\n');

const SEPARATOR_STORIES = readFixture('separator.component.stories.txt');
const SEPARATOR_MD = readFixture('separator.component.md');
const REAL_CEM = readFileSync(
  join(repositoryRoot, 'packages/components/custom-elements.json'),
  'utf8',
);

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
    [join(APPS_DOCS_DIR, 'src/stories/tokens/t2/color.mdx')]: COLOR_MDX,
    [join(APPS_DOCS_DIR, 'src/stories/assets/t1-color.md')]: COLOR_MD,
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
    [join(APPS_DOCS_DIR, '../../packages/components/custom-elements.json')]: REAL_CEM,
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
    expect(outputs.has(join(DIST_DIR, 'llms/design-tokens/t1/color.md'))).toBe(true);
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
    expect(llmsTxt).toContain('## Design Tokens');
    expect(llmsTxt).toContain('## Components');
    expect(llmsTxt).toContain('## Optional');
    expect(llmsTxt).toContain('- [Components/CHANGELOG](llms/components/changelog.md)');
    expect(llmsTxt).toContain('(DESIGN.md)');

    const llmsFull = outputs.get(join(DIST_DIR, 'llms-full.txt')) ?? '';
    expect(llmsFull.startsWith('# DESIGN.md')).toBe(true);
    expect(llmsFull).toContain('---\n\n# Welcome');
    expect(llmsFull).toContain('# Components/CHANGELOG');
  });

  it('throws when a link target is missing from the dist directory', () => {
    const inputs = createInputFiles();
    delete inputs[join(DIST_DIR, 'DESIGN.md')];
    const { deps } = createDeps(inputs);
    expect(() => generateLlmsDocs(BASE_OPTIONS, deps)).toThrow('Broken llms.txt link: DESIGN.md');
  });

  it('omits the DESIGN.md optional link when the source file is unavailable', () => {
    const inputs = createInputFiles();
    delete inputs[join(APPS_DOCS_DIR, 'public/DESIGN.md')];
    const { deps, outputs } = createDeps(inputs);
    const result = generateLlmsDocs(BASE_OPTIONS, deps);
    expect(result.fileCount).toBe(6);
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
});
