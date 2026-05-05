import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationToKotlinValDeclarationString } from './kotlin-variable-declaration-to-kotlin-val-declaration-string.ts';

export function kotlinVariableDeclarationsToKotlinValDeclarationsString(
  declarations: Iterable<KotlinVariableDeclaration>,
): string {
  let output: string = '';

  for (const declaration of declarations) {
    if (output !== '') {
      output += '\n';
    }
    output += kotlinVariableDeclarationToKotlinValDeclarationString(declaration);
  }

  return output;
}
