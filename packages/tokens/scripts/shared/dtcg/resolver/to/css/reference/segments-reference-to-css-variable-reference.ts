import type { SegmentsReference } from '../../../../design-token/reference/types/segments/segments-reference.ts';
import { DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION } from '../token/name/default-generate-css-variable-name-function.ts';
import type { GenerateCssVariableNameFunction } from '../token/name/generate-css-variable-name-function.ts';
import type { CurlyReferenceToCssVariableReferenceOptions } from './curly-reference-to-css-variable-reference.ts';

export interface SegmentsReferenceToCssVariableReferenceOptions {
  readonly generateCssVariableName?: GenerateCssVariableNameFunction;
}

export function segmentsReferenceToCssVariableReference(
  reference: SegmentsReference,
  {
    generateCssVariableName = DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
  }: CurlyReferenceToCssVariableReferenceOptions = {},
): string {
  return `var(${generateCssVariableName(reference)})`;
}
