import type { BorderDesignTokensCollectionToken } from '../../../../../../token/types/composite/border/border-design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  borderDesignTokensCollectionTokenValueToCssValue,
  type BorderDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/border-design-tokens-collection-token-value-to-css-value.ts';

export interface BorderDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    BorderDesignTokensCollectionTokenValueToCssValueOptions {}

export function borderDesignTokensCollectionTokenToCssVariableDeclaration(
  token: BorderDesignTokensCollectionToken,
  options?: BorderDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: BorderDesignTokensCollectionTokenValue): string =>
      borderDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
