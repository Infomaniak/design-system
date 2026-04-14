import { describe, expect, test } from 'vitest';
import type { ShadowDesignToken } from '../../../../../../../../design-token/token/types/composite/types/shadow/shadow-design-token.ts';
import type { ObjectArrayShadowDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object-array/object-array-shadow-design-token-value.ts';
import type { ObjectShadowDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object/object-shadow-design-token-value.ts';
import {
  ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences,
  ensureObjectShadowDesignTokenValueContainsOnlyReferences,
  ensureShadowDesignTokenContainsOnlyReferences,
} from './ensure-shadow-design-token-contains-only-references.ts';

describe('ensureShadowDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: ShadowDesignToken = {
      $value: '{shadow.primary}',
    };

    expect(() => ensureShadowDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: ShadowDesignToken = {
      $value: { $ref: 'shadow.primary' },
    };

    expect(() => ensureShadowDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains object value with all references', () => {
    const token: ShadowDesignToken = {
      $value: {
        color: '{color.black}',
        offsetX: '{spacing.0}',
        offsetY: '{spacing.4}',
        blur: '{spacing.8}',
        spread: '{spacing.0}',
      },
    };

    expect(() => ensureShadowDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains array of object values with all references', () => {
    const token: ShadowDesignToken = {
      $value: [
        {
          color: '{color.black}',
          offsetX: '{spacing.0}',
          offsetY: '{spacing.2}',
          blur: '{spacing.4}',
          spread: '{spacing.0}',
        },
        {
          color: '{color.gray.500}',
          offsetX: '{spacing.0}',
          offsetY: '{spacing.4}',
          blur: '{spacing.8}',
          spread: '{spacing.0}',
        },
      ],
    };

    expect(() => ensureShadowDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when object value contains direct color value', () => {
    const token: ShadowDesignToken = {
      $value: {
        color: {
          colorSpace: 'srgb',
          components: [0, 0, 0],
          hex: '#000000',
        },
        offsetX: '{spacing.0}',
        offsetY: '{spacing.4}',
        blur: '{spacing.8}',
        spread: '{spacing.0}',
      },
    };

    expect(() => ensureShadowDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when array contains object with direct offsetX value', () => {
    const token: ShadowDesignToken = {
      $value: [
        {
          color: '{color.black}',
          offsetX: {
            value: 0,
            unit: 'px',
          },
          offsetY: '{spacing.4}',
          blur: '{spacing.8}',
          spread: '{spacing.0}',
        },
      ],
    };

    expect(() => ensureShadowDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});

describe('ensureObjectShadowDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when value contains all references', () => {
    const value: ObjectShadowDesignTokenValue = {
      color: '{color.black}',
      offsetX: '{spacing.0}',
      offsetY: '{spacing.4}',
      blur: '{spacing.8}',
      spread: '{spacing.0}',
    };

    expect(() => ensureObjectShadowDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should throw when color is not a reference', () => {
    const value: ObjectShadowDesignTokenValue = {
      color: {
        colorSpace: 'srgb',
        components: [0, 0, 0],
        hex: '#000000',
      },
      offsetX: '{spacing.0}',
      offsetY: '{spacing.4}',
      blur: '{spacing.8}',
      spread: '{spacing.0}',
    };

    expect(() => ensureObjectShadowDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when offsetX is not a reference', () => {
    const value: ObjectShadowDesignTokenValue = {
      color: '{color.black}',
      offsetX: {
        value: 0,
        unit: 'px',
      },
      offsetY: '{spacing.4}',
      blur: '{spacing.8}',
      spread: '{spacing.0}',
    };

    expect(() => ensureObjectShadowDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});

describe('ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when array contains curly reference', () => {
    const value: ObjectArrayShadowDesignTokenValue = ['{shadow.primary}'];

    expect(() =>
      ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw when array contains JSON reference', () => {
    const value: ObjectArrayShadowDesignTokenValue = [{ $ref: 'shadow.primary' }];

    expect(() =>
      ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw when array contains objects with all references', () => {
    const value: ObjectArrayShadowDesignTokenValue = [
      {
        color: '{color.black}',
        offsetX: '{spacing.0}',
        offsetY: '{spacing.4}',
        blur: '{spacing.8}',
        spread: '{spacing.0}',
      },
    ];

    expect(() =>
      ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should throw when array contains object with direct value', () => {
    const value: ObjectArrayShadowDesignTokenValue = [
      {
        color: {
          colorSpace: 'srgb',
          components: [0, 0, 0],
          hex: '#000000',
        },
        offsetX: '{spacing.0}',
        offsetY: '{spacing.4}',
        blur: '{spacing.8}',
        spread: '{spacing.0}',
      },
    ];

    expect(() => ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});
