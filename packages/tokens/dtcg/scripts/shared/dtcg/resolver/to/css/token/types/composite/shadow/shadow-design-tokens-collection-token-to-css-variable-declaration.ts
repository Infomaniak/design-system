import type { ShadowDesignTokensCollectionToken } from '../../../../../../token/types/composite/shadow/shadow-design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/shadow/value/shadow-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  shadowDesignTokensCollectionTokenValueToCssValue,
  type ShadowDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/shadow-design-tokens-collection-token-value-to-css-value.ts';

export interface ShadowDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    ShadowDesignTokensCollectionTokenValueToCssValueOptions {}

export function shadowDesignTokensCollectionTokenToCssVariableDeclaration(
  token: ShadowDesignTokensCollectionToken,
  options?: ShadowDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: ShadowDesignTokensCollectionTokenValue): string =>
      shadowDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
