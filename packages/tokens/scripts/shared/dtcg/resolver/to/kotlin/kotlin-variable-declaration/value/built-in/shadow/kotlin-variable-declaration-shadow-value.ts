import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../../typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationShadowValue = TypedKotlinVariableDeclarationValue<'Shadow'>;

export function isKotlinVariableDeclarationShadowValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationShadowValue {
  return input.type === 'Shadow';
}
