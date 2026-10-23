import { describe, expect, it } from 'vitest';
import {
  DESIGN_SYSTEM_NAME,
  DESIGN_SYSTEM_TAGLINE,
  buildLinkUrl,
  renderLlmsTxt,
  validateLlmsTxtLinks,
} from './llms-txt.ts';
import type { PageModel } from './types.ts';

function page(overrides: Partial<PageModel> & Pick<PageModel, 'title' | 'outputPath'>): PageModel {
  return {
    category: 'Components',
    slugParts: ['components'],
    summary: '',
    prose: '',
    importSection: '',
    props: '',
    examples: [],
    ...overrides,
  };
}

describe('renderLlmsTxt', () => {
  it('renders the header, core rules and categories', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [
        page({
          title: 'Welcome',
          outputPath: 'llms/welcome.md',
          category: 'Welcome',
          summary: 'Entry point.',
        }),
        page({ title: 'Components/Separator', outputPath: 'llms/components/separator.md' }),
      ],
      baseUrl: '',
      designMdAvailable: false,
    });
    expect(llmsTxt).toContain(`# ${DESIGN_SYSTEM_NAME}`);
    expect(llmsTxt).toContain(`> ${DESIGN_SYSTEM_TAGLINE}`);
    expect(llmsTxt).toContain('Always import components from the root package');
    expect(llmsTxt).toContain('ingest one or the other, not both.');
    expect(llmsTxt).toContain('## Welcome\n\n- [Welcome](llms/welcome.md): Entry point.');
    expect(llmsTxt).toContain(
      '## Components\n\n- [Components/Separator](llms/components/separator.md)',
    );
    expect(llmsTxt.endsWith('\n')).toBe(true);
  });

  it('moves optional pages to the Optional section', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [
        page({ title: 'Components/CHANGELOG', outputPath: 'llms/components/changelog.md' }),
        page({ title: 'Components/Separator', outputPath: 'llms/components/separator.md' }),
      ],
      baseUrl: '',
      designMdAvailable: true,
    });
    expect(llmsTxt).toContain(
      '## Components\n\n- [Components/Separator](llms/components/separator.md)',
    );
    expect(llmsTxt).toContain(
      '## Optional\n\n- [Components/CHANGELOG](llms/components/changelog.md)',
    );
    expect(llmsTxt).toContain(
      '- [DESIGN.md (raw token reference)](DESIGN.md): Machine-readable token hierarchy',
    );
  });

  it('builds absolute urls with a base url', () => {
    const llmsTxt = renderLlmsTxt({
      pages: [page({ title: 'Welcome', outputPath: 'llms/welcome.md', category: 'Welcome' })],
      baseUrl: 'https://example.com/base/',
      designMdAvailable: false,
    });
    expect(llmsTxt).toContain('(https://example.com/base/llms/welcome.md)');
    expect(llmsTxt).toContain('(https://example.com/base/llms-full.txt)');
  });
});

describe('buildLinkUrl', () => {
  it('trims trailing slashes from the base url', () => {
    expect(buildLinkUrl('llms/welcome.md', 'https://example.com')).toBe(
      'https://example.com/llms/welcome.md',
    );
    expect(buildLinkUrl('llms/welcome.md', '')).toBe('llms/welcome.md');
  });
});

describe('validateLlmsTxtLinks', () => {
  it('validates relative link targets against the dist directory', () => {
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [Welcome](llms/welcome.md)\n- [Full](llms-full.txt)',
        distDir: '/dist',
        baseUrl: '',
        readFile: () => 'content',
      }),
    ).not.toThrow();
  });

  it('throws on missing or empty link targets', () => {
    const readFile = (path: string): string => {
      if (path === '/dist/empty.md') return '';
      if (path === '/dist/a.md') return 'x';
      throw new Error(`File not found: ${path}`);
    };
    const input = { distDir: '/dist', baseUrl: '', readFile };
    expect(() => validateLlmsTxtLinks({ llmsTxt: '- [X](llms/missing.md)', ...input })).toThrow(
      'Broken llms.txt link: llms/missing.md',
    );
    expect(() => validateLlmsTxtLinks({ llmsTxt: '- [X](empty.md)', ...input })).toThrow(
      'Empty llms.txt link target: empty.md',
    );
  });

  it('strips the base url prefix and skips external links', () => {
    const readFileCalls: string[] = [];
    expect(() =>
      validateLlmsTxtLinks({
        llmsTxt: '- [A](https://github.com/x)\n- [B](https://example.com/base/llms/a.md)',
        distDir: '/dist',
        baseUrl: 'https://example.com/base',
        readFile: (path) => {
          readFileCalls.push(path);
          return 'x';
        },
      }),
    ).not.toThrow();
    expect(readFileCalls).toEqual(['/dist/llms/a.md']);
  });
});
