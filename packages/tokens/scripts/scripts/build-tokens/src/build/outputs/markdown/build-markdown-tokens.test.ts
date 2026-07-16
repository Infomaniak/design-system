import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { MarkdownTokenRow } from '../../../../../../shared/dtcg/resolver/to/markdown/token/markdown-token-row.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import {
  MATERIAL_DIRECTORY_NAME,
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../../../constants/design-token-tiers.ts';
import { generateRowContent, renderTokenToRow } from './build-markdown-tokens.ts';

function createMockColorToken(fileTier: string): GenericDesignTokensCollectionToken {
  return {
    files: [`/tokens/${fileTier}/color.tokens.json`],
    name: ['color', 'background', 'base'],
    type: 'color',
    value: { hex: '#f4364f', components: [0.956, 0.211, 0.309], colorSpace: 'srgb' },
    description: 'Base background color',
  };
}

function createMockUnmappedColorToken(fileTier: string): GenericDesignTokensCollectionToken {
  return {
    files: [`/tokens/${fileTier}/color.tokens.json`],
    name: ['color'],
    type: 'color',
    value: { hex: '#ffffff', components: [1, 1, 1], colorSpace: 'srgb' },
    description: 'Unmapped color',
  };
}

function createMockDurationToken(fileTier: string): GenericDesignTokensCollectionToken {
  return {
    files: [`/tokens/${fileTier}/duration.tokens.json`],
    name: ['duration', 'fast'],
    type: 'duration',
    value: { value: '100', unit: 'ms' },
    description: 'Fast transition duration',
  };
}

function createMockNumberToken(fileTier: string): GenericDesignTokensCollectionToken {
  return {
    files: [`/tokens/${fileTier}/number.tokens.json`],
    name: ['opacity', 'medium'],
    type: 'number',
    value: { value: '0.5', unit: '' },
    description: 'Medium opacity',
  };
}

function createContextWithTokens(tierPrefix: string, tokens: GenericDesignTokensCollectionToken[]) {
  return {
    collection: new DesignTokensCollection(tokens),
    tierPrefix,
  };
}

describe('renderTokenToRow', () => {
  describe('tailwind class attachment by tier', () => {
    it('should attach tailwindClasses for T2 tokens', () => {
      const token = createMockColorToken(T2_DIRECTORY_NAME);
      const context = createContextWithTokens('t2', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toStrictEqual(['bg-background-base']);
    });

    it('should attach tailwindClasses for T3 tokens', () => {
      const token = createMockColorToken(T3_DIRECTORY_NAME);
      const context = createContextWithTokens('t3', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toStrictEqual(['bg-background-base']);
    });

    it('should omit tailwindClasses for T1 tokens', () => {
      const token = createMockColorToken(T1_DIRECTORY_NAME);
      const context = createContextWithTokens('t1', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toBeUndefined();
    });

    it('should omit tailwindClasses for material tokens', () => {
      const token = createMockColorToken(MATERIAL_DIRECTORY_NAME);
      const context = createContextWithTokens('material', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toBeUndefined();
    });
  });

  describe('unmapped tokens on T2/T3', () => {
    it('should return row with tailwindClasses set to null when getTailwindClass returns null', () => {
      const token = createMockUnmappedColorToken(T2_DIRECTORY_NAME);
      const context = createContextWithTokens('t2', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toBeNull();
      expect(row!.name).toBe('color');
    });

    it('should return row with tailwindClasses set to null for T3 unmapped tokens', () => {
      const token = createMockUnmappedColorToken(T3_DIRECTORY_NAME);
      const context = createContextWithTokens('t3', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toBeNull();
    });
  });

  describe('unsupported token types', () => {
    it('should return undefined for token types with no markdown renderer', () => {
      const token = createMockDurationToken(T2_DIRECTORY_NAME);
      const context = createContextWithTokens('t2', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeUndefined();
    });
  });

  describe('number token edge case', () => {
    it('should render number tokens and attach tailwindClasses on T2', () => {
      const token = createMockNumberToken(T2_DIRECTORY_NAME);
      const context = createContextWithTokens('t2', [token]);
      const row = renderTokenToRow(token, context);
      expect(row).toBeDefined();
      expect(row!.tailwindClasses).toStrictEqual(['opacity-medium']);
      expect(row!.name).toBe('opacity.medium');
    });
  });
});

describe('generateRowContent', () => {
  it('should render Tailwind buttons when tailwindClasses is an array', () => {
    const row: MarkdownTokenRow = {
      preview: '<div>Preview</div>',
      name: 'color.background.base',
      cssVariable: '--esds-color-background-base',
      tailwindClasses: ['bg-background-base', 'text-content-primary'],
      description: 'A sample color token',
    };
    const html = generateRowContent(row);
    expect(html).toContain('Tailwind:');
    expect(html).toContain('bg-background-base');
    expect(html).toContain('text-content-primary');
    expect(html).toContain('data-clipboard="bg-background-base"');
    expect(html).toContain('data-clipboard="text-content-primary"');
    expect(html).toContain('class="token-value"');
    expect(html).toContain('<button');
  });

  it('should omit Tailwind row when tailwindClasses is null', () => {
    const row: MarkdownTokenRow = {
      preview: '<div>Preview</div>',
      name: 'color',
      cssVariable: '--esds-color',
      tailwindClasses: null,
      description: 'Unmapped token',
    };
    const html = generateRowContent(row);
    expect(html).not.toContain('Tailwind:');
    expect(html).not.toContain('data-clipboard="bg-');
    expect(html).toContain('var(--esds-color)');
  });

  it('should omit Tailwind row when tailwindClasses is undefined', () => {
    const row: MarkdownTokenRow = {
      preview: '<div>Preview</div>',
      name: 'color.background.base',
      cssVariable: '--esds-color-background-base',
      description: 'T1 token',
    };
    const html = generateRowContent(row);
    expect(html).not.toContain('Tailwind:');
    expect(html).toContain('var(--esds-color-background-base)');
  });

  it('should omit CSS variable for material tokens', () => {
    const row: MarkdownTokenRow = {
      preview: '<div>Preview</div>',
      name: 'material.elevation.1',
      cssVariable: '--esds-material-elevation-1',
      description: 'Material token',
    };
    const html = generateRowContent(row);
    expect(html).not.toContain('CSS:');
    expect(html).not.toContain('var(--esds-material-elevation-1)');
    expect(html).toContain('material.elevation.1');
  });

  it('should include all parts for a normal token row', () => {
    const row: MarkdownTokenRow = {
      preview: '<div>Color swatch</div>',
      name: 'color.red.500',
      cssVariable: '--esds-color-red-500',
      tailwindClasses: ['bg-red-500'],
      description: 'Primary red 500',
    };
    const html = generateRowContent(row);
    expect(html).toContain('Color swatch');
    expect(html).toContain('color.red.500');
    expect(html).toContain('var(--esds-color-red-500)');
    expect(html).toContain('bg-red-500');
    expect(html).toContain('Primary red 500');
    expect(html).toContain('<tr>');
    expect(html).toContain('</tr>');
  });
});
