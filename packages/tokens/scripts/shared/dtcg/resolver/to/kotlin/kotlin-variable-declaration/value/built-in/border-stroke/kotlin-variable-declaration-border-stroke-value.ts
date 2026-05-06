import type { KotlinVariableDeclarationValue } from '../../kotlin-variable-declaration-value.ts';
import type { TypedKotlinVariableDeclarationValue } from '../__typed/typed-kotlin-variable-declaration-value.ts';

export type KotlinVariableDeclarationBorderStrokeValue =
  TypedKotlinVariableDeclarationValue<'BorderStroke'>;

export function isKotlinVariableDeclarationBorderStrokeValue(
  input: KotlinVariableDeclarationValue,
): input is KotlinVariableDeclarationBorderStrokeValue {
  return input.type === 'BorderStroke';
}
