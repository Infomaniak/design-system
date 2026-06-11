import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationFloatValue = TypedKotlinVariableDeclarationValue<'Float'>;

export function isKotlinVariableDeclarationFloatValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationFloatValue {
  return input.type === 'Float';
}
