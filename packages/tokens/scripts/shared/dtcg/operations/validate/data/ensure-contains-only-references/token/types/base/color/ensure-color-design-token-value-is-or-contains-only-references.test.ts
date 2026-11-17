import { describe, expect, test } from 'vitest';
import type { ValueOrDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import { ensureColorDesignTokenValueIsOrContainsOnlyReferences } from './ensure-color-design-token-value-is-or-contains-only-references.ts';

describe('ensureColorDesignTokenValueIsOrContainsOnlyReferences', () => {
  test('should not throw when value is a curly reference', () => {
    const $value: ValueOrDesignTokenReference<ColorDesignTokenValue> = '{color.red.500}';

    expect(() => ensureColorDesignTokenValueIsOrContainsOnlyReferences($value)).not.toThrow();
  });

  test('should not throw when value is a JSON reference', () => {
    const $value: ValueOrDesignTokenReference<ColorDesignTokenValue> = { $ref: 'color.red.500' };

    expect(() => ensureColorDesignTokenValueIsOrContainsOnlyReferences($value)).not.toThrow();
  });

  test('should not throw when value is an object with referenced components', () => {
    const $value: ValueOrDesignTokenReference<ColorDesignTokenValue> = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
    };

    expect(() => ensureColorDesignTokenValueIsOrContainsOnlyReferences($value)).not.toThrow();
  });

  test('should throw when value is an object with direct components value', () => {
    const $value: ValueOrDesignTokenReference<ColorDesignTokenValue> = {
      colorSpace: 'srgb',
      components: [0, 0.4, 0.8],
      hex: '#0066cc',
    };

    expect(() => ensureColorDesignTokenValueIsOrContainsOnlyReferences($value)).toThrow();
  });
});
