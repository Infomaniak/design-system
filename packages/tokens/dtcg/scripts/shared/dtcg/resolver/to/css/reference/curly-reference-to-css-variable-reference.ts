import type { CurlyReference } from '../../../../design-token/reference/types/curly/curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION } from '../token/name/default-generate-css-variable-name-function.ts';
import type { GenerateCssVariableNameFunction } from '../token/name/generate-css-variable-name-function.ts';

export interface CurlyReferenceToCssVariableReferenceOptions {
  readonly generateCssVariableName?: GenerateCssVariableNameFunction;
}

export function curlyReferenceToCssVariableReference(
  reference: CurlyReference,
  {
    generateCssVariableName = DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
  }: CurlyReferenceToCssVariableReferenceOptions = {},
): string {
  return `var(${generateCssVariableName(curlyReferenceToSegmentsReference(reference))})`;
}
