import type { SegmentsReference } from '../../../../design-token/reference/types/segments/segments-reference.ts';
import { DEFAULT_GENERATE_KOTLIN_VARIABLE_NAME_FUNCTION } from '../token/name/default-generate-kotlin-variable-name-function.ts';
import type { GenerateKotlinVariableNameFunction } from '../token/name/generate-kotlin-variable-name-function.ts';
import type { CurlyReferenceToKotlinVariableReferenceOptions } from './curly-reference-to-kotlin-variable-reference.ts';

export interface SegmentsReferenceToKotlinVariableReferenceOptions {
  readonly generateKotlinVariableName?: GenerateKotlinVariableNameFunction;
}

export function segmentsReferenceToKotlinVariableReference(
  reference: SegmentsReference,
  {
    generateKotlinVariableName = DEFAULT_GENERATE_KOTLIN_VARIABLE_NAME_FUNCTION,
  }: CurlyReferenceToKotlinVariableReferenceOptions = {},
): string {
  return generateKotlinVariableName(reference);
}
