import { describe, expect, test } from 'vitest';
import type { StrokeStyleDesignToken } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/stroke-style-design-token.ts';
import type { StrokeStyleDesignTokenValueDashArray } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/members/dash-array/stroke-style-design-token-value-dash-array.ts';
import type { ObjectStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/object-stroke-style-design-token-value.ts';
import type { PredefinedStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/predefined-stroke-style-design-token-value.ts';
import {
  ensureObjectStrokeStyleDesignTokenValueContainsOnlyReferences,
  ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences,
  ensureStrokeStyleDesignTokenContainsOnlyReferences,
  ensureStrokeStyleDesignTokenValueDashArrayContainsOnlyReferences,
} from './ensure-stroke-style-design-token-contains-only-references.ts';

describe('ensureStrokeStyleDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: StrokeStyleDesignToken = {
      $value: '{stroke.style.solid}',
    };

    expect(() => ensureStrokeStyleDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: StrokeStyleDesignToken = {
      $value: { $ref: 'stroke.style.solid' },
    };

    expect(() => ensureStrokeStyleDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains predefined style value', () => {
    const token: StrokeStyleDesignToken = {
      $value: 'solid',
    };

    expect(() => ensureStrokeStyleDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains object value with dashArray of references', () => {
    const token: StrokeStyleDesignToken = {
      $value: {
        dashArray: ['{spacing.4}', '{spacing.2}'],
        lineCap: 'round',
      },
    };

    expect(() => ensureStrokeStyleDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when object dashArray contains direct dimension value', () => {
    const token: StrokeStyleDesignToken = {
      $value: {
        dashArray: [
          {
            value: 4,
            unit: 'px',
          },
          '{spacing.2}',
        ],
        lineCap: 'round',
      },
    };

    expect(() => ensureStrokeStyleDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});

describe('ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw for solid', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'solid';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for dashed', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'dashed';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for dotted', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'dotted';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for double', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'double';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for groove', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'groove';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for ridge', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'ridge';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for outset', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'outset';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should not throw for inset', () => {
    const value: PredefinedStrokeStyleDesignTokenValue = 'inset';
    expect(() =>
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });
});

describe('ensureObjectStrokeStyleDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when dashArray contains all references', () => {
    const value: ObjectStrokeStyleDesignTokenValue = {
      dashArray: ['{spacing.4}', '{spacing.2}', '{spacing.4}'],
      lineCap: 'round',
    };

    expect(() =>
      ensureObjectStrokeStyleDesignTokenValueContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should throw when dashArray contains direct value', () => {
    const value: ObjectStrokeStyleDesignTokenValue = {
      dashArray: [
        {
          value: 4,
          unit: 'px',
        },
        '{spacing.2}',
      ],
      lineCap: 'round',
    };

    expect(() => ensureObjectStrokeStyleDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});

describe('ensureStrokeStyleDesignTokenValueDashArrayContainsOnlyReferences', () => {
  test('should not throw when all items are references', () => {
    const value: StrokeStyleDesignTokenValueDashArray = [
      '{spacing.4}',
      '{spacing.2}',
      '{spacing.4}',
    ];

    expect(() =>
      ensureStrokeStyleDesignTokenValueDashArrayContainsOnlyReferences(value),
    ).not.toThrow();
  });

  test('should throw when an item is a direct dimension value', () => {
    const value: StrokeStyleDesignTokenValueDashArray = [
      '{spacing.4}',
      {
        value: 2,
        unit: 'px',
      },
      '{spacing.4}',
    ];

    expect(() => ensureStrokeStyleDesignTokenValueDashArrayContainsOnlyReferences(value)).toThrow();
  });
});
