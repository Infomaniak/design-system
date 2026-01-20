import type { CssVariableDeclaration } from '../css-variable-declaration.ts';
import { cssVariableDeclarationToString } from './css-variable-declaration-to-string.ts';

export function cssVariableDeclarationsToString(
  declarations: Iterable<CssVariableDeclaration>,
): string {
  let output: string = '';

  for (const declaration of declarations) {
    output += `${cssVariableDeclarationToString(declaration)}\n`;
  }

  return output;
}
