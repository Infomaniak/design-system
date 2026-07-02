import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../design-tokens-collection.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import { fontSizeDesignTokensCollectionTokenToMarkdown } from './font-size-design-tokens-collection-token-to-markdown.ts';

describe('fontSizeDesignTokensCollectionTokenToMarkdown', () => {
  const mockContext = {
    collection: new DesignTokensCollection([
      {
        files: [],
        name: ['font', 'size', 'md'],
        type: 'dimension',
        value: { value: 16, unit: 'px' },
      } as DimensionDesignTokensCollectionToken,
    ]),
  } as MarkdownRenderContext;

  it('shows the resolved value for T1 tokens (direct values)', () => {
    const token: DimensionDesignTokensCollectionToken = {
      files: [],
      name: ['font', 'size', 'lg'],
      type: 'dimension',
      value: { value: 18, unit: 'px' },
    };

    const result = fontSizeDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('18px');
    expect(result.preview).not.toContain('data-preview-value');
  });

  it('resolves and shows the concrete value for T2 reference tokens', () => {
    const token: DimensionDesignTokensCollectionToken = {
      files: [],
      name: ['font', 'size', 'semantic', 'body'],
      type: 'dimension',
      value: '{font.size.md}',
    } as DimensionDesignTokensCollectionToken;

    const result = fontSizeDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('16px');
    expect(result.preview).not.toContain('data-preview-value');
  });
});
