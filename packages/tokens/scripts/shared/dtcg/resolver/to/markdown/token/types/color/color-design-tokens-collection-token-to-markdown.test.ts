import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../design-tokens-collection.ts';
import type { ColorDesignTokensCollectionToken } from '../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import { colorDesignTokensCollectionTokenToMarkdown } from './color-design-tokens-collection-token-to-markdown.ts';

describe('colorDesignTokensCollectionTokenToMarkdown', () => {
  const mockContext = {
    collection: new DesignTokensCollection([
      {
        files: [],
        name: ['color', 'red', '500'],
        type: 'color',
        value: { hex: '#f4364f', components: [0.956, 0.211, 0.309], colorSpace: 'srgb' },
      } as ColorDesignTokensCollectionToken,
    ]),
  } as MarkdownRenderContext;

  it('includes data-preview-value for T1 tokens so browser resolves the color', () => {
    const token: ColorDesignTokensCollectionToken = {
      files: [],
      name: ['color', 'red', '600'],
      type: 'color',
      value: { hex: '#e11d3d', components: [0.882, 0.114, 0.239], colorSpace: 'srgb' },
    };

    const result = colorDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('data-preview-value="--esds-color-red-600"');
    expect(result.preview).toContain('background: var(--esds-color-red-600)');
    expect(result.preview).toContain('margin-top: 4px');
    expect(result.preview).toContain('font-size: 12px');
    expect(result.name).toBe('color.red.600');
  });

  it('includes data-preview-value for T2 reference tokens so browser resolves the color', () => {
    const token: ColorDesignTokensCollectionToken = {
      files: [],
      name: ['color', 'primary'],
      type: 'color',
      value: '{color.red.500}',
    } as ColorDesignTokensCollectionToken;

    const result = colorDesignTokensCollectionTokenToMarkdown(token, mockContext);

    expect(result.preview).toContain('data-preview-value="--esds-color-primary"');
    expect(result.preview).toContain('background: var(--esds-color-primary)');
    expect(result.preview).toContain('margin-top: 4px');
    expect(result.preview).toContain('font-size: 12px');
  });
});
