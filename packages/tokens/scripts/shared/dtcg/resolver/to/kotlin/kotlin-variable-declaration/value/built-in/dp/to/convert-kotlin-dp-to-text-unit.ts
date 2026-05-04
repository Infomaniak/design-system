import type { KotlinVariableDeclarationTextUnitValue } from '../../text-unit/kotlin-variable-declaration-text-unit-value.ts';
import type { KotlinVariableDeclarationDpValue } from '../kotlin-variable-declaration-dp-value.ts';

export function convertKotlinDpToTextUnit(
  input: KotlinVariableDeclarationDpValue,
): KotlinVariableDeclarationTextUnitValue {
  return {
    type: 'TextUnit',
    value: `${input.value.slice(0, -3 /* ".dp".length */)}.sp`,
  };
}
