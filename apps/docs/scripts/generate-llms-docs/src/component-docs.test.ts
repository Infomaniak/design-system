import { describe, expect, it } from 'vitest';
import {
  extractComponentTag,
  extractRawDocImportPath,
  loadComponentDocs,
  resolveImportPath,
} from './component-docs.ts';

const STORIES_SOURCE = [
  "import documentation from './esds-separator.component.md?raw';",
  '',
  'const meta = {',
  "  component: 'esds-separator',",
  '  parameters: { docs: { description: { component: documentation } } },',
  '} satisfies Meta;',
].join('\n');

describe('extractRawDocImportPath', () => {
  it('extracts the companion markdown import path', () => {
    expect(extractRawDocImportPath(STORIES_SOURCE)).toBe('./esds-separator.component.md');
  });

  it('returns null without a raw doc import', () => {
    expect(extractRawDocImportPath("const meta = { component: 'x' };")).toBeNull();
  });
});

describe('extractComponentTag', () => {
  it('extracts the component tag from the meta', () => {
    expect(extractComponentTag(STORIES_SOURCE)).toBe('esds-separator');
  });

  it('returns null without a component field', () => {
    expect(extractComponentTag('const meta = { title: "X" };')).toBeNull();
  });
});

describe('resolveImportPath', () => {
  it('resolves relative imports from the importing file directory', () => {
    expect(resolveImportPath('/repo/docs/src/stories/page.mdx', '../assets/x.md')).toBe(
      '/repo/docs/src/assets/x.md',
    );
  });
});

describe('loadComponentDocs', () => {
  it('loads the companion markdown prose', () => {
    const docs = loadComponentDocs({
      storiesFilePath: '/repo/packages/components/src/x/esds-x.stories.ts',
      storiesSource: STORIES_SOURCE,
      readFile: (path) => (path.endsWith('esds-separator.component.md') ? 'Separator prose.' : ''),
    });
    expect(docs).toEqual({ tagName: 'esds-separator', prose: 'Separator prose.' });
  });

  it('returns null prose when no doc import exists', () => {
    const docs = loadComponentDocs({
      storiesFilePath: '/repo/x.stories.ts',
      storiesSource: "const meta = { component: 'x' };",
      readFile: () => '',
    });
    expect(docs).toEqual({ tagName: 'x', prose: null });
  });
});
