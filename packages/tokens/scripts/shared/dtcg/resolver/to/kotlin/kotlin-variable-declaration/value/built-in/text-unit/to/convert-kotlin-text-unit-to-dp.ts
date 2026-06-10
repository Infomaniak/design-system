import type { KotlinVariableDeclarationDpValue } from '../../dp/kotlin-variable-declaration-dp-value.ts';
import type { KotlinVariableDeclarationTextUnitValue } from '../kotlin-variable-declaration-text-unit-value.ts';

export function convertKotlinTextUnitToDp(
  input: KotlinVariableDeclarationTextUnitValue,
): KotlinVariableDeclarationDpValue {
  return {
    type: 'Dp',
    value: `${input.value.slice(0, -3 /* ".sp".length */)}.dp`,
  };
}
