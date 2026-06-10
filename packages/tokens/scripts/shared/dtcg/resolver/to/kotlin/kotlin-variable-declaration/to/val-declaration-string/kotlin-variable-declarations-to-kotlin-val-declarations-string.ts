import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import {
  kotlinVariableDeclarationToKotlinValDeclarationString,
  type KotlinVariableDeclarationToKotlinValDeclarationStringOptions,
} from './kotlin-variable-declaration-to-kotlin-val-declaration-string.ts';

export type KotlinVariableDeclarationsToKotlinValDeclarationsStringOptions =
  KotlinVariableDeclarationToKotlinValDeclarationStringOptions;

export function kotlinVariableDeclarationsToKotlinValDeclarationsString(
  declarations: Iterable<KotlinVariableDeclaration>,
  options?: KotlinVariableDeclarationsToKotlinValDeclarationsStringOptions,
): string {
  let output: string = '';

  for (const declaration of declarations) {
    if (output !== '') {
      output += '\n';
    }
    output += kotlinVariableDeclarationToKotlinValDeclarationString(declaration, options);
  }

  return output;
}
