import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../../typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationColorValue = TypedKotlinVariableDeclarationValue<'Color'>;

export function isKotlinVariableDeclarationColorValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationColorValue {
  return input.type === 'Color';
}
