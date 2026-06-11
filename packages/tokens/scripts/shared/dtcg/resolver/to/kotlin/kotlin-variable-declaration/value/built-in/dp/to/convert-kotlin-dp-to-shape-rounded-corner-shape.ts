import type { KotlinVariableDeclarationShapeValue } from '../../shape/kotlin-variable-declaration-shape-value.ts';
import type { KotlinVariableDeclarationDpValue } from '../kotlin-variable-declaration-dp-value.ts';

export function convertKotlinDpToShapeRoundedCornerShape(
  input: KotlinVariableDeclarationDpValue,
): KotlinVariableDeclarationShapeValue {
  return {
    type: 'Shape',
    value: `RoundedCornerShape(${input.value})`,
  };
}
