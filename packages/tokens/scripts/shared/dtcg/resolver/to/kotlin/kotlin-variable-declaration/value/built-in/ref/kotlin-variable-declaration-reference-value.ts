import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../../typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationReferenceValue = TypedKotlinVariableDeclarationValue<'ref'>;

export function isKotlinVariableDeclarationRefValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationReferenceValue {
  return input.type === 'ref';
}
