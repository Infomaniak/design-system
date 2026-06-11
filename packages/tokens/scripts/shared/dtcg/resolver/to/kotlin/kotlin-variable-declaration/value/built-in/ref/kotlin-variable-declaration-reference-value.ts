import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export interface KotlinVariableDeclarationReferenceValue extends TypedKotlinVariableDeclarationValue<'ref'> {
  readonly valueType?: string;
}

export function isKotlinVariableDeclarationRefValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationReferenceValue {
  return input.type === 'ref';
}
