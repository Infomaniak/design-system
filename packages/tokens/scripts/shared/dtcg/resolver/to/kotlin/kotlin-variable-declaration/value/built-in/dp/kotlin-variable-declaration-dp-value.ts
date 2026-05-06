import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationDpValue = TypedKotlinVariableDeclarationValue<'Dp'>;

export function isKotlinVariableDeclarationDpValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationDpValue {
  return input.type === 'Dp';
}
