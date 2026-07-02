import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../design-tokens-collection.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import { dimensionDesignTokensCollectionTokenToMarkdown } from './dimension-design-tokens-collection-token-to-markdown.ts';

describe('dimensionDesignTokensCollectionTokenToMarkdown', () => {
  const mockContext = {
    collection: new DesignTokensCollection([
      {
        files: [],
        name: ['spacing', '4'],
        type: 'dimension',
        value: { value: 4, unit: 'px' },
      } as DimensionDesignTokensCollectionToken,
    ]),
  } as MarkdownRenderContext;

  it('shows the resolved value for T1 tokens (direct values)', () => {
    const token: DimensionDesignTokensCollectionToken = {
      files: [],
      name: ['spacing', '8'],
      type: 'dimension',
      value: { value: 8, unit: 'px' },
    };

    const result = dimensionDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('8px');
    expect(result.name).toBe('spacing.8');
    expect(result.cssVariable).toBe('--esds-spacing-8');
  });

  it('resolves and shows the concrete value for T2 reference tokens', () => {
    const token: DimensionDesignTokensCollectionToken = {
      files: [],
      name: ['spacing', 'semantic', 'small'],
      type: 'dimension',
      value: '{spacing.4}',
    } as DimensionDesignTokensCollectionToken;

    const result = dimensionDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('4px');
    expect(result.preview).not.toContain('data-preview-value');
    expect(result.name).toBe('spacing.semantic.small');
    expect(result.cssVariable).toBe('--esds-spacing-semantic-small');
  });
});
