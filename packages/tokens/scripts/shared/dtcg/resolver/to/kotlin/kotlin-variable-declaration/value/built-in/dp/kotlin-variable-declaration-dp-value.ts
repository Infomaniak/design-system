import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../../typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationDpValue = TypedKotlinVariableDeclarationValue<'Dp'>;

export function isKotlinVariableDeclarationDpValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationDpValue {
  return input.type === 'Dp';
}
