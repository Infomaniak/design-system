import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { CssVariableDeclaration } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';

export interface BaseCssVariableDeclaration {
  readonly token: GenericDesignTokensCollectionToken;
  readonly declaration: CssVariableDeclaration;
}

/**
 * Generates the CSS variable declaration of every base token, paired with its
 * source token. Computed once and shared by the base files, the modifier files
 * and the dynamic token names computation.
 */
export function buildBaseCssVariableDeclarations(
  baseCollection: DesignTokensCollection,
  cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions,
): BaseCssVariableDeclaration[] {
  return Array.from(
    baseCollection.tokens(),
    (token: GenericDesignTokensCollectionToken): BaseCssVariableDeclaration => ({
      token,
      declaration: designTokensCollectionTokenToCssVariableDeclaration(
        {
          ...token,
          type: baseCollection.resolve(token).type,
        },
        cssOptions,
      ),
    }),
  );
}
