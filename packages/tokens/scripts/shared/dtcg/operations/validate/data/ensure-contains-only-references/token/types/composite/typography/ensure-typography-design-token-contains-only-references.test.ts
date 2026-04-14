import { describe, expect, test } from 'vitest';
import type { TypographyDesignToken } from '../../../../../../../../design-token/token/types/composite/types/typography/typography-design-token.ts';
import type { TypographyDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/typography/value/typography-design-token-value.ts';
import {
  ensureTypographyDesignTokenContainsOnlyReferences,
  ensureTypographyDesignTokenValueContainsOnlyReferences,
} from './ensure-typography-design-token-contains-only-references.ts';

describe('ensureTypographyDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: TypographyDesignToken = {
      $value: '{typography.heading}',
    };

    expect(() => ensureTypographyDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: TypographyDesignToken = {
      $value: { $ref: 'typography.heading' },
    };

    expect(() => ensureTypographyDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains object value with all references', () => {
    const token: TypographyDesignToken = {
      $value: {
        fontFamily: '{font.family.primary}',
        fontSize: '{font.size.large}',
        fontWeight: '{font.weight.bold}',
        letterSpacing: '{letter.spacing.normal}',
        lineHeight: '{line.height.normal}',
      },
    };

    expect(() => ensureTypographyDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains object value with direct fontFamily value', () => {
    const token: TypographyDesignToken = {
      $value: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '{font.size.large}',
        fontWeight: '{font.weight.bold}',
        letterSpacing: '{letter.spacing.normal}',
        lineHeight: '{line.height.normal}',
      },
    };

    expect(() => ensureTypographyDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains object value with direct fontSize value', () => {
    const token: TypographyDesignToken = {
      $value: {
        fontFamily: '{font.family.primary}',
        fontSize: {
          value: 16,
          unit: 'px',
        },
        fontWeight: '{font.weight.bold}',
        letterSpacing: '{letter.spacing.normal}',
        lineHeight: '{line.height.normal}',
      },
    };

    expect(() => ensureTypographyDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});

describe('ensureTypographyDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when value contains all references', () => {
    const value: TypographyDesignTokenValue = {
      fontFamily: '{font.family.primary}',
      fontSize: '{font.size.large}',
      fontWeight: '{font.weight.bold}',
      letterSpacing: '{letter.spacing.normal}',
      lineHeight: '{line.height.normal}',
    };

    expect(() => ensureTypographyDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should throw when fontFamily is not a reference', () => {
    const value: TypographyDesignTokenValue = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '{font.size.large}',
      fontWeight: '{font.weight.bold}',
      letterSpacing: '{letter.spacing.normal}',
      lineHeight: '{line.height.normal}',
    };

    expect(() => ensureTypographyDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when fontSize is not a reference', () => {
    const value: TypographyDesignTokenValue = {
      fontFamily: '{font.family.primary}',
      fontSize: {
        value: 16,
        unit: 'px',
      },
      fontWeight: '{font.weight.bold}',
      letterSpacing: '{letter.spacing.normal}',
      lineHeight: '{line.height.normal}',
    };

    expect(() => ensureTypographyDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when fontWeight is not a reference', () => {
    const value: TypographyDesignTokenValue = {
      fontFamily: '{font.family.primary}',
      fontSize: '{font.size.large}',
      fontWeight: 700,
      letterSpacing: '{letter.spacing.normal}',
      lineHeight: '{line.height.normal}',
    };

    expect(() => ensureTypographyDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when letterSpacing is not a reference', () => {
    const value: TypographyDesignTokenValue = {
      fontFamily: '{font.family.primary}',
      fontSize: '{font.size.large}',
      fontWeight: '{font.weight.bold}',
      letterSpacing: {
        value: 0.5,
        unit: 'px',
      },
      lineHeight: '{line.height.normal}',
    };

    expect(() => ensureTypographyDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when lineHeight is not a reference', () => {
    const value: TypographyDesignTokenValue = {
      fontFamily: '{font.family.primary}',
      fontSize: '{font.size.large}',
      fontWeight: '{font.weight.bold}',
      letterSpacing: '{letter.spacing.normal}',
      lineHeight: 1.5,
    };

    expect(() => ensureTypographyDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});
