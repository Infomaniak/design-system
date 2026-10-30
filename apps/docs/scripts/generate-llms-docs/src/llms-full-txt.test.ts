import { describe, expect, it } from 'vitest';
import { renderLlmsFullTxt } from './llms-full-txt.ts';
import type { PageModel } from './types.ts';

function page(title: string, outputPath: string, category: string): PageModel {
  return {
    title,
    category,
    slugParts: outputPath.replace('llms/', '').replace('.md', '').split('/'),
    outputPath,
    summary: '',
    prose: `Prose for ${title}.`,
    importSection: '',
    props: '',
    examples: [],
    componentKind: null,
    componentTagName: null,
    componentAttributeNames: [],
  };
}

describe('renderLlmsFullTxt', () => {
  it('prepends DESIGN.md and joins pages with separators', () => {
    const llmsFull = renderLlmsFullTxt({
      pages: [
        page('Welcome', 'llms/welcome.md', 'Welcome'),
        page('Components/Separator', 'llms/components/separator.md', 'Components'),
      ],
      designMd: '# DESIGN.md\n\nToken reference.',
    });
    const parts = llmsFull.split('\n\n---\n\n');
    expect(parts[0]).toBe('# DESIGN.md\n\nToken reference.');
    expect(parts[1]).toBe('# Welcome\n\nProse for Welcome.');
    expect(parts[2]).toBe('# Components/Separator\n\nProse for Components/Separator.\n');
    expect(llmsFull.endsWith('\n')).toBe(true);
  });

  it('starts with the first page when DESIGN.md is unavailable', () => {
    const llmsFull = renderLlmsFullTxt({
      pages: [page('Welcome', 'llms/welcome.md', 'Welcome')],
      designMd: null,
    });
    expect(llmsFull.startsWith('# Welcome')).toBe(true);
  });
});
