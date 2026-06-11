import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationTextUnitValue =
  TypedKotlinVariableDeclarationValue<'TextUnit'>;

export function isKotlinVariableDeclarationTextUnitValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationTextUnitValue {
  return input.type === 'TextUnit';
}
