import type { DesignTokensCollection } from '../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { CssVariableDeclaration } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationToString } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declaration-to-string.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';

export interface ComputeDynamicTokenNamesOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions;
}

/**
 * Computes the CSS variable names whose value must be re-resolved per element
 * (declared under `:where(*)`): every token overridden by at least one modifier
 * context, plus every token referencing them, transitively.
 *
 * All other tokens can safely be declared once on `:root` and inherited.
 */
export function computeDynamicTokenNames({
  baseCollection,
  modifiers,
  cssOptions,
}: ComputeDynamicTokenNamesOptions): ReadonlySet<string> {
  const baseDeclarations: Map<string, CssVariableDeclaration> = new Map();
  const tokenNameByCssName: Map<string, readonly string[]> = new Map();

  for (const token of baseCollection.tokens()) {
    const declaration: CssVariableDeclaration = designTokensCollectionTokenToCssVariableDeclaration(
      {
        ...token,
        type: baseCollection.resolve(token).type,
      },
      cssOptions,
    );

    baseDeclarations.set(declaration.name, declaration);
    tokenNameByCssName.set(declaration.name, token.name);
  }

  // Seeds: tokens whose value differs in at least one modifier context.
  const dynamicKeys: Set<string> = new Set();
  const queue: (readonly string[])[] = [];

  for (const contexts of modifiers.values()) {
    for (const collection of contexts.values()) {
      for (const token of collection.tokens()) {
        const declaration: CssVariableDeclaration =
          designTokensCollectionTokenToCssVariableDeclaration(
            {
              ...token,
              type: collection.resolve(token).type,
            },
            cssOptions,
          );
        const base: CssVariableDeclaration | undefined = baseDeclarations.get(declaration.name);

        if (
          base !== undefined &&
          cssVariableDeclarationToString(base) === cssVariableDeclarationToString(declaration)
        ) {
          continue;
        }

        const tokenName: readonly string[] | undefined = tokenNameByCssName.get(declaration.name);

        if (tokenName === undefined) {
          continue;
        }

        const key: string = JSON.stringify(tokenName);

        if (!dynamicKeys.has(key)) {
          dynamicKeys.add(key);
          queue.push(tokenName);
        }
      }
    }
  }

  // Transitive closure over reverse references.
  for (let index = 0; index < queue.length; index += 1) {
    const tokenName: readonly string[] = queue[index]!;

    for (const referencer of baseCollection.getTokensDirectlyReferencing(tokenName)) {
      const key: string = JSON.stringify(referencer.name);

      if (!dynamicKeys.has(key)) {
        dynamicKeys.add(key);
        queue.push(referencer.name);
      }
    }
  }

  const dynamicCssNames: Set<string> = new Set();

  for (const [cssName, tokenName] of tokenNameByCssName) {
    if (dynamicKeys.has(JSON.stringify(tokenName))) {
      dynamicCssNames.add(cssName);
    }
  }

  return dynamicCssNames;
}
