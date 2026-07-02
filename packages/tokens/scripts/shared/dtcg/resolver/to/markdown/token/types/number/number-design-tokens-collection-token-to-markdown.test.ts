import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../design-tokens-collection.ts';
import type { NumberDesignTokensCollectionToken } from '../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import { numberDesignTokensCollectionTokenToMarkdown } from './number-design-tokens-collection-token-to-markdown.ts';

describe('numberDesignTokensCollectionTokenToMarkdown', () => {
  const mockContext = {
    collection: new DesignTokensCollection([
      {
        files: [],
        name: ['opacity', '50'],
        type: 'number',
        value: 0.5,
      } as NumberDesignTokensCollectionToken,
    ]),
  } as MarkdownRenderContext;

  it('shows the resolved value for T1 tokens (direct values)', () => {
    const token: NumberDesignTokensCollectionToken = {
      files: [],
      name: ['opacity', '75'],
      type: 'number',
      value: 0.75,
    };

    const result = numberDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('0.75');
    expect(result.preview).not.toContain('data-preview-value');
  });

  it('resolves and shows the concrete value for T2 reference tokens', () => {
    const token: NumberDesignTokensCollectionToken = {
      files: [],
      name: ['opacity', 'semantic', 'medium'],
      type: 'number',
      value: '{opacity.50}',
    } as NumberDesignTokensCollectionToken;

    const result = numberDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('0.50');
    expect(result.preview).toContain('(50%)');
    expect(result.preview).not.toContain('data-preview-value');
  });
});
