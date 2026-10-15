import { describe, expect, it } from 'vitest';
import { renderLlmsFullTxt } from './llms-full-txt.ts';
import type { PageModel } from './types.ts';

function page(title: string, prose: string): PageModel {
  return {
    title,
    category: title.split('/')[0] ?? title,
    slugParts: ['x'],
    outputPath: `llms/${title.toLowerCase().replaceAll('/', '-')}.md`,
    summary: 'summary',
    prose,
    importSection: '',
    props: '',
    examples: [],
  };
}

describe('renderLlmsFullTxt', () => {
  it('concatenates DESIGN.md and all pages with horizontal rules', () => {
    const output = renderLlmsFullTxt({
      pages: [page('Welcome', 'Welcome body.'), page('Components/Button', 'Button body.')],
      designMd: '# DESIGN.md\n\nToken reference.',
    });
    expect(output).toBe(
      '# DESIGN.md\n\nToken reference.\n\n---\n\n# Welcome\n\n> summary\n\nWelcome body.\n\n---\n\n# Components/Button\n\n> summary\n\nButton body.\n',
    );
  });

  it('omits DESIGN.md when missing', () => {
    const output = renderLlmsFullTxt({ pages: [page('Welcome', 'Welcome body.')], designMd: null });
    expect(output).toBe('# Welcome\n\n> summary\n\nWelcome body.\n');
  });

  it('omits DESIGN.md when blank', () => {
    const output = renderLlmsFullTxt({ pages: [page('Welcome', 'Welcome body.')], designMd: '  ' });
    expect(output).toBe('# Welcome\n\n> summary\n\nWelcome body.\n');
  });

  it('returns only a newline when there is nothing to concatenate', () => {
    expect(renderLlmsFullTxt({ pages: [], designMd: null })).toBe('\n');
  });
});
