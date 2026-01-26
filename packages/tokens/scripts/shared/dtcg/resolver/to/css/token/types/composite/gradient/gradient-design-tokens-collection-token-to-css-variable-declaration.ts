import type { GradientDesignTokensCollectionToken } from '../../../../../../token/types/composite/gradient/gradient-design-tokens-collection-token.ts';
import type { GradientDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/gradient/value/gradient-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration/css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  gradientDesignTokensCollectionTokenValueToCssValue,
  type GradientDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/gradient-design-tokens-collection-token-value-to-css-value.ts';

export interface GradientDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    GradientDesignTokensCollectionTokenValueToCssValueOptions {}

export function gradientDesignTokensCollectionTokenToCssVariableDeclaration(
  token: GradientDesignTokensCollectionToken,
  options?: GradientDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: GradientDesignTokensCollectionTokenValue): string =>
      gradientDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
