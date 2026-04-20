import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { StrokeStyleDesignToken } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/stroke-style-design-token.ts';
import type { StrokeStyleDesignTokenValueDashArray } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/members/dash-array/stroke-style-design-token-value-dash-array.ts';
import type { ObjectStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/object-stroke-style-design-token-value.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { PredefinedStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/predefined-stroke-style-design-token-value.ts';

export function ensureStrokeStyleDesignTokenContainsOnlyReferences(
  token: StrokeStyleDesignToken,
): void {
  if (!isDesignTokenReference(token.$value)) {
    if (isPredefinedStrokeStyleDesignTokenValue(token.$value)) {
      ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(token.$value);
    } else {
      ensureObjectStrokeStyleDesignTokenValueContainsOnlyReferences(token.$value);
    }
  }
}

export function ensurePredefinedStrokeStyleDesignTokenValueContainsOnlyReferences(
  _value: PredefinedStrokeStyleDesignTokenValue,
): void {
  // nothing to do
}

export function ensureObjectStrokeStyleDesignTokenValueContainsOnlyReferences(
  value: ObjectStrokeStyleDesignTokenValue,
): void {
  ensureStrokeStyleDesignTokenValueDashArrayContainsOnlyReferences(value.dashArray);
}

export function ensureStrokeStyleDesignTokenValueDashArrayContainsOnlyReferences(
  value: StrokeStyleDesignTokenValueDashArray,
): void {
  for (const strokeStyle of value) {
    expectDesignTokenReference(strokeStyle);
  }
}
