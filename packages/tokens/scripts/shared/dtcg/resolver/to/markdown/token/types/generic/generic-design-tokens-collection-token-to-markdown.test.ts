import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../design-tokens-collection.ts';
import type { DesignTokensCollectionTokenWithType } from '../../../../../token/design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import { genericDesignTokensCollectionTokenToMarkdown } from './generic-design-tokens-collection-token-to-markdown.ts';

describe('genericDesignTokensCollectionTokenToMarkdown', () => {
  const mockContext = {
    collection: new DesignTokensCollection([
      {
        files: [],
        name: ['duration', '100'],
        type: 'duration',
        value: { duration: 100, unit: 'ms' },
      } as DesignTokensCollectionTokenWithType<string, unknown>,
    ]),
  } as MarkdownRenderContext;

  it('shows the resolved value for T1 tokens (direct values)', () => {
    const token: DesignTokensCollectionTokenWithType<string, unknown> = {
      files: [],
      name: ['duration', 'transition'],
      type: 'duration',
      value: { duration: 300, unit: 'ms' },
    };

    const result = genericDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('300');
    expect(result.preview).not.toContain('data-preview-value');
  });

  it('resolves and shows the concrete value for T2 reference tokens', () => {
    const token: DesignTokensCollectionTokenWithType<string, unknown> = {
      files: [],
      name: ['duration', 'semantic', 'fast'],
      type: 'duration',
      value: '{duration.100}',
    } as DesignTokensCollectionTokenWithType<string, unknown>;

    const result = genericDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('100');
    expect(result.preview).not.toContain('data-preview-value');
    expect(result.preview).not.toContain('Reference token');
  });
});
