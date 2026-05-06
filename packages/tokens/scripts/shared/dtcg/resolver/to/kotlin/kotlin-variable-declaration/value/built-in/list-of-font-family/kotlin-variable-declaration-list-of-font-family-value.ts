import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationListOfFontFamilyValue =
  TypedKotlinVariableDeclarationValue<'List<FontFamily>'>;

export function isKotlinVariableDeclarationListOfFontFamilyValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationListOfFontFamilyValue {
  return input.type === 'List<FontFamily>';
}
