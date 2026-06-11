import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationFontFamilyValue =
  TypedKotlinVariableDeclarationValue<'FontFamily'>;

export function isKotlinVariableDeclarationFontFamilyValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationFontFamilyValue {
  return input.type === 'FontFamily';
}
