import {
  designTokenNameSegmentsToCssVarName,
  type DesignTokenNameSegmentsToCssVarNameOptions,
} from '../../../../../token/name/segments/to/css-var-name/design-token-name-segments-to-css-var-name.ts';
import type { SegmentsDesignTokenReference } from '../../segments-design-token-reference.ts';

export interface SegmentsDesignTokenReferenceToCssVarReferenceOptions extends DesignTokenNameSegmentsToCssVarNameOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties#referencing_custom_properties_with_var
 */
export function segmentsDesignTokenReferenceToCssVarReference(
  reference: SegmentsDesignTokenReference,
  options?: SegmentsDesignTokenReferenceToCssVarReferenceOptions,
): string {
  return `var(${designTokenNameSegmentsToCssVarName(reference, options)})`;
}
