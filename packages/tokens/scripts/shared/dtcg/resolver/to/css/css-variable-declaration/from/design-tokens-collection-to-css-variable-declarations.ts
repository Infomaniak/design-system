import { DesignTokensCollection } from '../../../../design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../token/design-tokens-collection-token.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../token/design-tokens-collection-token-to-css-variable-declaration.ts';
import type { CssVariableDeclaration } from '../css-variable-declaration.ts';

export interface DesignTokensCollectionToCssVariableDeclarationsOptions extends DesignTokensCollectionTokenToCssVariableDeclarationOptions {}

export function designTokensCollectionToCssVariableDeclarations(
  collection: DesignTokensCollection,
  options?: DesignTokensCollectionToCssVariableDeclarationsOptions,
): CssVariableDeclaration[] {
  return collection
    .getMergedTokens()
    .map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
      return designTokensCollectionTokenToCssVariableDeclaration(
        {
          ...token,
          type: collection.resolve(token).type,
        },
        options,
      );
    });
}
