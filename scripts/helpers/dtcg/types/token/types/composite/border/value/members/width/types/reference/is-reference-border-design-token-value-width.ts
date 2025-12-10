import { isDesignTokenReference } from '../../../../../../../../../reference/is-design-token-reference.ts';
import type { BorderDesignTokenValueWidth } from '../../border-design-token-value-width.ts';
import type { ReferenceBorderDesignTokenValueWidth } from './reference-border-design-token-value-width.ts';

export function isReferenceBorderDesignTokenValueWidth(
  input: BorderDesignTokenValueWidth,
): input is ReferenceBorderDesignTokenValueWidth {
  return isDesignTokenReference(input);
}
