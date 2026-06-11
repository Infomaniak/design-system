import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { KotlinVariableDeclarationValue } from '../kotlin-variable-declaration/value/kotlin-variable-declaration-value.ts';
import {
  curlyReferenceToKotlinVariableDeclarationReferenceValue,
  type CurlyReferenceToKotlinVariableReferenceOptions,
} from './curly-reference-to-kotlin-variable-reference.ts';

export type ValueOrCurlyReferenceToKotlinVariableReferenceOptions =
  CurlyReferenceToKotlinVariableReferenceOptions;

export function valueOrCurlyReferenceToKotlinVariableReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => KotlinVariableDeclarationValue,
  options?: ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
): KotlinVariableDeclarationValue {
  return isCurlyReference(value)
    ? curlyReferenceToKotlinVariableDeclarationReferenceValue(value, options)
    : mapValue(value);
}
