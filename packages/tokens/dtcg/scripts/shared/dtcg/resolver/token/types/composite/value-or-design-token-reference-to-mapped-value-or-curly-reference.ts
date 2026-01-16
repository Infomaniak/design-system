import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../design-token/reference/value-or/value-or-design-token-reference.ts';

export function valueOrDesignTokenReferenceToMappedValueOrCurlyReference<GValue, GNewValue>(
  valueOrReference: ValueOrDesignTokenReference<GValue>,
  map: (value: GValue) => GNewValue,
): ValueOrCurlyReference<GNewValue> {
  return isDesignTokenReference(valueOrReference)
    ? designTokenReferenceToCurlyReference(valueOrReference)
    : map(valueOrReference);
}
