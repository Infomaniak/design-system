import { describe, expect, it } from 'vitest';
import {
  DESIGN_SYSTEM_NAME,
  DESIGN_SYSTEM_TAGLINE,
  buildLinkUrl,
  renderLlmsTxt,
  validateLlmsTxtTargets,
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
    componentKind: null,
    componentTagName: null,
    componentAttributeNames: [],
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

describe('validateLlmsTxtTargets', () => {
  it('validates every target against the dist directory', () => {
    expect(() =>
      validateLlmsTxtTargets({
        distDir: '/dist',
        targets: ['llms/welcome.md', 'llms-full.txt'],
        readFile: () => 'content',
      }),
    ).not.toThrow();
  });

  it('throws on missing targets', () => {
    const readFile = (): string => {
      throw new Error('File not found');
    };
    expect(() =>
      validateLlmsTxtTargets({ distDir: '/dist', targets: ['llms/missing.md'], readFile }),
    ).toThrow('Missing llms.txt target: llms/missing.md');
  });

  it('throws on empty targets', () => {
    const readFile = (): string => '';
    expect(() =>
      validateLlmsTxtTargets({ distDir: '/dist', targets: ['empty.md'], readFile }),
    ).toThrow('Empty llms.txt target: empty.md');
  });
});
