import { describe, expect, test } from 'vitest';
import type { GradientDesignToken } from '../../../../../../../../design-token/token/types/composite/types/gradient/gradient-design-token.ts';
import type { GradientDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/gradient/value/gradient-design-token-value.ts';
import type { ObjectGradientDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/gradient/value/members/object/object-gradient-design-token-value.ts';
import {
  ensureGradientDesignTokenContainsOnlyReferences,
  ensureGradientDesignTokenValueContainsOnlyReferences,
  ensureObjectGradientDesignTokenValueContainsOnlyReferences,
} from './ensure-gradient-design-token-contains-only-references.ts';

describe('ensureGradientDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: GradientDesignToken = {
      $value: '{gradient.primary}',
    };

    expect(() => ensureGradientDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: GradientDesignToken = {
      $value: { $ref: 'gradient.primary' },
    };

    expect(() => ensureGradientDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains array with references in objects', () => {
    const token: GradientDesignToken = {
      $value: [
        { color: '{color.red}', position: '{gradient.position.start}' },
        { color: '{color.blue}', position: '{gradient.position.end}' },
      ],
    };

    expect(() => ensureGradientDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when array contains object with direct color value', () => {
    const token: GradientDesignToken = {
      $value: [
        {
          color: {
            colorSpace: 'srgb',
            components: [1, 0, 0],
          },
          position: '{gradient.position.start}',
        },
        { color: '{color.blue}', position: '{gradient.position.end}' },
      ],
    };

    expect(() => ensureGradientDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when array contains object with direct position value', () => {
    const token: GradientDesignToken = {
      $value: [
        { color: '{color.red}', position: 0 },
        { color: '{color.blue}', position: '{gradient.position.end}' },
      ],
    };

    expect(() => ensureGradientDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});

describe('ensureGradientDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when value contains color and position references', () => {
    const value: GradientDesignTokenValue = [
      { color: '{color.red}', position: '{gradient.position.30}' },
      { color: '{color.blue}', position: '{gradient.position.70}' },
    ];

    expect(() => ensureGradientDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should not throw when value contains only references', () => {
    const value: GradientDesignTokenValue = ['{color.red}'];

    expect(() => ensureGradientDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should throw when value contains object with direct color', () => {
    const value: GradientDesignTokenValue = [
      {
        color: {
          colorSpace: 'srgb',
          components: [1, 0, 0],
        },
        position: '{gradient.position.start}',
      },
    ];

    expect(() => ensureGradientDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});

describe('ensureObjectGradientDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when value contains all references', () => {
    const value: ObjectGradientDesignTokenValue = {
      color: '{color.red}',
      position: '{gradient.position.start}',
    };

    expect(() => ensureObjectGradientDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should throw when color is not a reference', () => {
    const value: ObjectGradientDesignTokenValue = {
      color: {
        colorSpace: 'srgb',
        components: [1, 0, 0],
      },
      position: '{gradient.position.start}',
    };

    expect(() => ensureObjectGradientDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when position is not a reference', () => {
    const value: ObjectGradientDesignTokenValue = {
      color: '{color.red}',
      position: 0,
    };

    expect(() => ensureObjectGradientDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});
