import { describe, expect, test } from 'vitest';
import type { BorderDesignToken } from '../../../../../../../../design-token/token/types/composite/types/border/border-design-token.ts';
import type { BorderDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/border/value/border-design-token-value.ts';
import {
  ensureBorderDesignTokenContainsOnlyReferences,
  ensureBorderDesignTokenValueContainsOnlyReferences,
} from './ensure-border-design-token-contains-only-references.ts';

describe('ensureBorderDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: BorderDesignToken = {
      $value: '{border.primary}',
    };

    expect(() => ensureBorderDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: BorderDesignToken = {
      $value: { $ref: 'border.primary' },
    };

    expect(() => ensureBorderDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains object value with all references', () => {
    const token: BorderDesignToken = {
      $value: {
        color: '{color.primary}',
        width: '{border.width.thick}',
        style: '{border.style.solid}',
      },
    };

    expect(() => ensureBorderDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains object value with direct color value', () => {
    const token: BorderDesignToken = {
      $value: {
        color: {
          colorSpace: 'srgb',
          components: [0, 0.4, 0.8],
          hex: '#0066cc',
        },
        width: '{border.width.thick}',
        style: '{border.style.solid}',
      },
    };

    expect(() => ensureBorderDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains object value with direct width value', () => {
    const token: BorderDesignToken = {
      $value: {
        color: '{color.primary}',
        width: {
          value: 2,
          unit: 'px',
        },
        style: '{border.style.solid}',
      },
    };

    expect(() => ensureBorderDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains object value with direct style value', () => {
    const token: BorderDesignToken = {
      $value: {
        color: '{color.primary}',
        width: '{border.width.thick}',
        style: 'solid',
      },
    };

    expect(() => ensureBorderDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});

describe('ensureBorderDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when value contains all references', () => {
    const value: BorderDesignTokenValue = {
      color: '{color.primary}',
      width: '{border.width.thick}',
      style: '{border.style.solid}',
    };

    expect(() => ensureBorderDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should throw when color is not a reference', () => {
    const value: BorderDesignTokenValue = {
      color: {
        colorSpace: 'srgb',
        components: [0, 0.4, 0.8],
        hex: '#0066cc',
      },
      width: '{border.width.thick}',
      style: '{border.style.solid}',
    };

    expect(() => ensureBorderDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});
