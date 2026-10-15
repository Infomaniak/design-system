import { describe, expect, it } from 'vitest';
import { buildLinkUrl, renderLlmsTxt, validateLlmsTxtLinks } from './llms-txt.ts';
import type { PageModel } from './types.ts';

function page(overrides: Partial<PageModel> & { title: string }): PageModel {
  return {
    category: overrides.title.split('/')[0] ?? overrides.title,
    slugParts: ['x'],
    outputPath: `llms/${overrides.title.toLowerCase().replaceAll('/', '-')}.md`,
    summary: `${overrides.title} summary`,
    prose: '',
    importSection: '',
    props: '',
    examples: [],
    ...overrides,
  };
}

const pages: PageModel[] = [
  page({ title: 'Welcome', outputPath: 'llms/welcome.md' }),
  page({ title: 'Design Tokens/T1/Color', outputPath: 'llms/design-tokens/t1/color.md' }),
  page({ title: 'Components/Separator', outputPath: 'llms/components/separator.md' }),
  page({ title: 'Components/CHANGELOG', outputPath: 'llms/components/changelog.md' }),
  page({ title: 'Design Tokens/DESIGN.md', outputPath: 'llms/design-tokens/design-md.md' }),
];

function createFiles(entries: Record<string, string>) {
  return (path: string): string => {
    const content = entries[path];
    if (content === undefined) throw new Error(`File not found: ${path}`);
    return content;
  };
}

describe('buildLinkUrl', () => {
  it('returns relative paths without a base url', () => {
    expect(buildLinkUrl('llms/welcome.md', '')).toBe('llms/welcome.md');
  });

  it('strips trailing slashes from the base url', () => {
    expect(buildLinkUrl('llms/welcome.md', 'https://example.com/base/')).toBe(
      'https://example.com/base/llms/welcome.md',
    );
  });
});

describe('renderLlmsTxt', () => {
  it('renders the llmstxt.org structure with relative links', () => {
    const llmsTxt = renderLlmsTxt({ pages, baseUrl: '', designMdAvailable: true });
    const lines = llmsTxt.split('\n');
    expect(lines[0]).toBe('# Infomaniak Design System');
    expect(lines[2]).toMatch(/^> /);
    expect(llmsTxt).toContain('(llms-full.txt)');
    expect(llmsTxt).toContain('## Welcome\n\n- [Welcome](llms/welcome.md): Welcome summary');
    expect(llmsTxt).toContain(
      '- [Design Tokens/T1/Color](llms/design-tokens/t1/color.md): Design Tokens/T1/Color summary',
    );
    expect(llmsTxt).toContain(
      '- [Components/Separator](llms/components/separator.md): Components/Separator summary',
    );
    expect(llmsTxt).toContain('## Optional');
    expect(llmsTxt).toContain(
      '- [Components/CHANGELOG](llms/components/changelog.md): Components/CHANGELOG summary',
    );
    expect(llmsTxt.split('- [Design Tokens/DESIGN.md]')).toHaveLength(2);
    expect(llmsTxt).toContain('(DESIGN.md)');
    expect(llmsTxt.trim().endsWith('## Optional')).toBe(false);
  });

  it('omits the raw DESIGN.md link when unavailable', () => {
    const llmsTxt = renderLlmsTxt({ pages, baseUrl: '', designMdAvailable: false });
    expect(llmsTxt).not.toContain('(DESIGN.md)');
    expect(llmsTxt).toContain('## Optional');
  });

  it('omits the summary suffix when a page has no summary', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [
        page({
          title: 'Design Tokens/T1/Blur',
          summary: '',
          outputPath: 'llms/design-tokens/t1/blur.md',
        }),
      ],
      baseUrl: '',
      designMdAvailable: false,
    });
    expect(llmsTxt).toContain('- [Design Tokens/T1/Blur](llms/design-tokens/t1/blur.md)\n');
    expect(llmsTxt).not.toContain(': ');
  });

  it('omits the Optional section entirely when there is no optional content', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [page({ title: 'Welcome', outputPath: 'llms/welcome.md' })],
      baseUrl: '',
      designMdAvailable: false,
    });
    expect(llmsTxt).not.toContain('## Optional');
  });

  it('handles pages with empty titles without throwing', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [page({ title: '', outputPath: 'llms/empty.md' })],
      baseUrl: '',
      designMdAvailable: false,
    });
    expect(llmsTxt).toContain('# Infomaniak Design System');
  });

  it('uses absolute links with a base url', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [page({ title: 'Welcome', outputPath: 'llms/welcome.md' })],
      baseUrl: 'https://example.com/base/',
      designMdAvailable: true,
    });
    expect(llmsTxt).toContain('(https://example.com/base/llms/welcome.md)');
    expect(llmsTxt).toContain('(https://example.com/base/llms-full.txt)');
    expect(llmsTxt).toContain('(https://example.com/base/DESIGN.md)');
  });
});

describe('validateLlmsTxtLinks', () => {
  const distFiles = createFiles({
    '/dist/llms/welcome.md': 'content',
    '/dist/llms-full.txt': 'content',
    '/dist/DESIGN.md': 'content',
  });

  it('passes when every link target exists and is non-empty', () => {
    const llmsTxt = [
      '- [Welcome](llms/welcome.md): x',
      '- [Full](llms-full.txt): y',
      '- [Tokens](DESIGN.md): z',
    ].join('\n');
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt,
        distDir: '/dist',
        baseUrl: '',
        readFile: distFiles,
      }),
    ).not.toThrow();
  });

  it('throws for a broken link', () => {
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [Missing](llms/missing.md): x',
        distDir: '/dist',
        baseUrl: '',
        readFile: distFiles,
      }),
    ).toThrow('Broken llms.txt link: llms/missing.md');
  });

  it('throws for an empty link target', () => {
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [Empty](llms/empty.md): x',
        distDir: '/dist',
        baseUrl: '',
        readFile: (path) => (path.endsWith('empty.md') ? '   ' : distFiles(path)),
      }),
    ).toThrow('Empty llms.txt link target: llms/empty.md');
  });

  it('skips external links', () => {
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [External](https://example.com/page): x',
        distDir: '/dist',
        baseUrl: '',
        readFile: distFiles,
      }),
    ).not.toThrow();
  });

  it('strips the base url before resolving', () => {
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [Welcome](https://example.com/base/llms/welcome.md): x',
        distDir: '/dist',
        baseUrl: 'https://example.com/base',
        readFile: distFiles,
      }),
    ).not.toThrow();
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [Missing](https://example.com/base/llms/missing.md): x',
        distDir: '/dist',
        baseUrl: 'https://example.com/base',
        readFile: distFiles,
      }),
    ).toThrow('Broken llms.txt link: https://example.com/base/llms/missing.md');
  });
});
