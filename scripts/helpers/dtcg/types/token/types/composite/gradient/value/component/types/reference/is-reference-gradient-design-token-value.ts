import { isDesignTokenReference } from '../../../../../../../../reference/is-design-token-reference.ts';
import type { ReferenceGradientDesignTokenValue } from './reference-gradient-design-token-value.ts';

export function isReferenceGradientDesignTokenValue(
  input: unknown,
): input is ReferenceGradientDesignTokenValue {
  return isDesignTokenReference(input);
}
