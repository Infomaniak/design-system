import { isDesignTokenReference } from '../../../../../../../../../reference/is-design-token-reference.ts';
import type { BorderDesignTokenValueStyle } from '../../border-design-token-value-style.ts';
import type { ReferenceBorderDesignTokenValueStyle } from './reference-border-design-token-value-style.ts';

export function isReferenceBorderDesignTokenValueStyle(
  input: BorderDesignTokenValueStyle,
): input is ReferenceBorderDesignTokenValueStyle {
  return isDesignTokenReference(input);
}
