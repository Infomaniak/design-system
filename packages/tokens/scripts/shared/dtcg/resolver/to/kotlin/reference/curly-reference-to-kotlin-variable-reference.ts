import type { CurlyReference } from '../../../../design-token/reference/types/curly/curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { KotlinVariableDeclarationReferenceValue } from '../kotlin-variable-declaration/value/built-in/ref/kotlin-variable-declaration-reference-value.ts';
import {
  segmentsReferenceToKotlinVariableReference,
  type SegmentsReferenceToKotlinVariableReferenceOptions,
} from './segments-reference-to-kotlin-variable-reference.ts';

export type CurlyReferenceToKotlinVariableReferenceOptions =
  SegmentsReferenceToKotlinVariableReferenceOptions;

export function curlyReferenceToKotlinVariableReference(
  reference: CurlyReference,
  options?: CurlyReferenceToKotlinVariableReferenceOptions,
): string {
  return segmentsReferenceToKotlinVariableReference(
    curlyReferenceToSegmentsReference(reference),
    options,
  );
}

export function curlyReferenceToKotlinVariableDeclarationReferenceValue(
  reference: CurlyReference,
  options?: CurlyReferenceToKotlinVariableReferenceOptions,
): KotlinVariableDeclarationReferenceValue {
  return {
    type: 'ref',
    value: curlyReferenceToKotlinVariableReference(reference, options),
  };
}
