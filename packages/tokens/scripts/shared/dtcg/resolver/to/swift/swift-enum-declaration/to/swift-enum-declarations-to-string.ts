import type { SwiftEnumDeclaration } from '../swift-enum-declaration.ts';
import { swiftEnumDeclarationToString } from './swift-enum-declaration-to-string.ts';

export function swiftEnumDeclarationsToString(
  declarations: Iterable<SwiftEnumDeclaration>,
): string {
  let output: string = '';

  for (const declaration of declarations) {
    if (output !== '') {
      output += '\n';
    }
    output += swiftEnumDeclarationToString(declaration);
  }

  return output;
}
