import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationTextStyleValue =
  TypedKotlinVariableDeclarationValue<'TextStyle'>;

export function isKotlinVariableDeclarationTextStyleValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationTextStyleValue {
  return input.type === 'TextStyle';
}
