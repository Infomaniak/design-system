import { describe, expect, test } from 'vitest';
import type { CubicBezierDesignToken } from '../../../../../../../../design-token/token/types/base/types/cubic-bezier/cubic-bezier-design-token.ts';
import { ensureCubicBezierDesignTokenContainsOnlyReferences } from './ensure-cubic-bezier-design-token-contains-only-references.ts';

describe('ensureCubicBezierDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: CubicBezierDesignToken = {
      $value: '{easing.easeInOut}',
    };

    expect(() => ensureCubicBezierDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: CubicBezierDesignToken = {
      $value: { $ref: 'easing.easeInOut' },
    };

    expect(() => ensureCubicBezierDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains direct cubic bezier array value', () => {
    const token: CubicBezierDesignToken = {
      $value: [0.4, 0, 0.2, 1],
    };

    expect(() => ensureCubicBezierDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
