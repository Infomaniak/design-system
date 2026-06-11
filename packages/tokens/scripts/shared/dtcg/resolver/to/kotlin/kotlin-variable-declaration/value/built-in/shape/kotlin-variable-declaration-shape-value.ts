import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationShapeValue = TypedKotlinVariableDeclarationValue<'Shape'>;

export function isKotlinVariableDeclarationShapeValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationShapeValue {
  return input.type === 'Shape';
}
