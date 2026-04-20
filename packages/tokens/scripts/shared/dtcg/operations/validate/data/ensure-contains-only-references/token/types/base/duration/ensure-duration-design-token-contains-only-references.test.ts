import { describe, expect, test } from 'vitest';
import type { DurationDesignToken } from '../../../../../../../../design-token/token/types/base/types/duration/duration-design-token.ts';
import { ensureDurationDesignTokenContainsOnlyReferences } from './ensure-duration-design-token-contains-only-references.ts';

describe('ensureDurationDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: DurationDesignToken = {
      $value: '{duration.fast}',
    };

    expect(() => ensureDurationDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: DurationDesignToken = {
      $value: { $ref: 'duration.fast' },
    };

    expect(() => ensureDurationDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains direct duration object value', () => {
    const token: DurationDesignToken = {
      $value: {
        value: 300,
        unit: 'ms',
      },
    };

    expect(() => ensureDurationDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
