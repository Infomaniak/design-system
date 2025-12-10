import { isDesignTokenReference } from '../../../../../../../../../reference/is-design-token-reference.ts';
import type { BorderDesignTokenValueColor } from '../../border-design-token-value-color.ts';
import type { ReferenceBorderDesignTokenValueColor } from './reference-border-design-token-value-color.ts';

export function isReferenceBorderDesignTokenValueColor(
  input: BorderDesignTokenValueColor,
): input is ReferenceBorderDesignTokenValueColor {
  return isDesignTokenReference(input);
}
