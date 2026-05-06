import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationFontWeightValue =
  TypedKotlinVariableDeclarationValue<'FontWeight'>;

export function isKotlinVariableDeclarationFontWeightValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationFontWeightValue {
  return input.type === 'FontWeight';
}
