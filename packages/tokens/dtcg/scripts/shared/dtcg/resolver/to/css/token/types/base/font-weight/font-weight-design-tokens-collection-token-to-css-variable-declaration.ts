import type { FontWeightDesignTokensCollectionToken } from '../../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { fontWeightDesignTokensCollectionTokenValueToCssValue } from './value/font-weight-design-tokens-collection-token-value-to-css-value.ts';

export interface FontWeightDesignTokensCollectionTokenToCssVariableDeclarationOptions extends DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions {}

export function fontWeightDesignTokensCollectionTokenToCssVariableDeclaration(
  token: FontWeightDesignTokensCollectionToken,
  options?: FontWeightDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    fontWeightDesignTokensCollectionTokenValueToCssValue,
    options,
  );
}
