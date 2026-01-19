import type { FontFamilyDesignTokensCollectionToken } from '../../../../../../token/types/base/font-family/font-family-design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { fontFamilyDesignTokensCollectionTokenValueToCssValue } from './value/font-family-design-tokens-collection-token-value-to-css-value.ts';

export interface FontFamilyDesignTokensCollectionTokenToCssVariableDeclarationOptions extends DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions {}

export function fontFamilyDesignTokensCollectionTokenToCssVariableDeclaration(
  token: FontFamilyDesignTokensCollectionToken,
  options?: FontFamilyDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    fontFamilyDesignTokensCollectionTokenValueToCssValue,
    options,
  );
}
