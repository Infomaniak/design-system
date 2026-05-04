import type { KotlinVariableDeclaration } from '../kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationToString } from './kotlin-variable-declaration-to-string.ts';

export function kotlinVariableDeclarationsToString(
  declarations: Iterable<KotlinVariableDeclaration>,
): string {
  let output: string = '';

  for (const declaration of declarations) {
    if (output !== '') {
      output += '\n';
    }
    output += kotlinVariableDeclarationToString(declaration);
  }

  return output;
}
