import type { ColorDesignTokensCollectionToken } from '../../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  colorDesignTokensCollectionTokenValueToCssValue,
  type ColorDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/color-design-tokens-collection-token-value-to-css-value.ts';

export interface ColorDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    ColorDesignTokensCollectionTokenValueToCssValueOptions {}

export function colorDesignTokensCollectionTokenToCssVariableDeclaration(
  token: ColorDesignTokensCollectionToken,
  options?: ColorDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: ColorDesignTokensCollectionTokenValue): string =>
      colorDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
