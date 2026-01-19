import type { TypographyDesignTokensCollectionToken } from '../../../../../../token/types/composite/typography/typography-design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  typographyDesignTokensCollectionTokenValueToCssValue,
  type TypographyDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/typography-design-tokens-collection-token-value-to-css-value.ts';

export interface TypographyDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    TypographyDesignTokensCollectionTokenValueToCssValueOptions {}

export function typographyDesignTokensCollectionTokenToCssVariableDeclaration(
  token: TypographyDesignTokensCollectionToken,
  options?: TypographyDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: TypographyDesignTokensCollectionTokenValue): string =>
      typographyDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
