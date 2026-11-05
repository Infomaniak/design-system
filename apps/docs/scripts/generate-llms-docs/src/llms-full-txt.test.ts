import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderLlmsFullTxt, validateLlmsFullTxtLinks } from './llms-full-txt.ts';
import type { PageModel } from './types.ts';

function page(
  title: string,
  outputPath: string,
  category: string,
  prose: string = `Prose for ${title}.`,
): PageModel {
  return {
    title,
    category,
    slugParts: outputPath.replace('llms/', '').replace('.md', '').split('/'),
    outputPath,
    summary: '',
    prose,
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

  it('omits a whitespace-only DESIGN.md', () => {
    const llmsFull = renderLlmsFullTxt({
      pages: [page('Welcome', 'llms/welcome.md', 'Welcome')],
      designMd: '   ',
    });
    expect(llmsFull.startsWith('# Welcome')).toBe(true);
  });

  it('rebases page links and root file links to the site root', () => {
    const llmsFull = renderLlmsFullTxt({
      pages: [
        page(
          'Typography',
          'llms/typography.md',
          'Typography',
          'See [text tokens](design-tokens/t2/text.md).',
        ),
        page(
          'Install the font',
          'llms/designers-guide/install-the-font.md',
          'Designers guide',
          'See [typography](../typography.md), [DESIGN.md](../DESIGN.md) and [index](./llms.txt).',
        ),
      ],
      designMd: '# DESIGN.md',
    });
    expect(llmsFull).toContain('[text tokens](llms/design-tokens/t2/text.md)');
    expect(llmsFull).toContain('[typography](llms/typography.md)');
    expect(llmsFull).toContain('[DESIGN.md](DESIGN.md)');
    expect(llmsFull).toContain('[index](llms.txt)');
  });

  it('leaves the DESIGN.md part verbatim', () => {
    const designMd = '# DESIGN.md\n\nSee [tokens](./tokens.md).';
    const llmsFull = renderLlmsFullTxt({
      pages: [page('Welcome', 'llms/welcome.md', 'Welcome')],
      designMd,
    });
    expect(llmsFull).toContain(designMd);
  });
});

describe('validateLlmsFullTxtLinks', () => {
  function validationInput(overrides: {
    content?: string;
    designMd?: string | null;
    files?: Record<string, string>;
  }) {
    return {
      distDir: '/dist',
      content:
        overrides.content ??
        renderLlmsFullTxt({
          pages: [
            page(
              'Welcome',
              'llms/welcome.md',
              'Welcome',
              'See [ai](ai-llms.md), [design](./DESIGN.md) and [tokens](design-tokens/t2/text.md#esds-text).',
            ),
          ],
          designMd: overrides.designMd === undefined ? '# DESIGN.md' : overrides.designMd,
        }),
      designMd: overrides.designMd === undefined ? '# DESIGN.md' : overrides.designMd,
      readFile: (path: string) => {
        const files: Record<string, string> = {
          [join('/dist', 'llms/welcome.md')]: '# Welcome',
          [join('/dist', 'llms/ai-llms.md')]: '# AI & LLMs',
          [join('/dist', 'DESIGN.md')]: '# DESIGN.md',
          [join('/dist', 'llms/design-tokens/t2/text.md')]: '# Text tokens',
          ...(overrides.files ?? {}),
        };
        const content = files[path];
        if (content === undefined) throw new Error(`File not found: ${path}`);
        return content;
      },
    };
  }

  it('passes when every page link target exists', () => {
    expect(() => validateLlmsFullTxtLinks(validationInput({}))).not.toThrow();
  });

  it('skips the DESIGN.md part', () => {
    expect(() =>
      validateLlmsFullTxtLinks(
        validationInput({ designMd: '# DESIGN.md\n\nSee [tokens](./tokens.md).' }),
      ),
    ).not.toThrow();
  });

  it('passes with a whitespace-only DESIGN.md', () => {
    expect(() => validateLlmsFullTxtLinks(validationInput({ designMd: '   ' }))).not.toThrow();
  });

  it('passes without a DESIGN.md', () => {
    expect(() => validateLlmsFullTxtLinks(validationInput({ designMd: null }))).not.toThrow();
  });

  it('validates the whole content when it does not start with DESIGN.md', () => {
    expect(() =>
      validateLlmsFullTxtLinks(
        validationInput({
          content: 'Standalone content linking [welcome](llms/welcome.md).',
          designMd: '# Unrelated DESIGN.md',
        }),
      ),
    ).not.toThrow();
  });

  it('throws when a page link target is missing from dist', () => {
    expect(() =>
      validateLlmsFullTxtLinks({
        distDir: '/dist',
        content: 'Standalone content linking [ai](llms/ai-llms.md).',
        designMd: null,
        readFile: (path: string) => {
          if (path === join('/dist', 'llms/ai-llms.md')) {
            throw new Error(`File not found: ${path}`);
          }
          return '# Content';
        },
      }),
    ).toThrow('Missing llms-full.txt link target: llms/ai-llms.md');
  });

  it('throws when a page link target is empty in dist', () => {
    expect(() =>
      validateLlmsFullTxtLinks(
        validationInput({ files: { [join('/dist', 'llms/ai-llms.md')]: '' } }),
      ),
    ).toThrow('Empty llms-full.txt link target: llms/ai-llms.md');
  });
});
