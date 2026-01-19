import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from './value/dimension-design-tokens-collection-token-value-to-css-value.ts';

export interface DimensionDesignTokensCollectionTokenToCssVariableDeclarationOptions extends DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions {}

export function dimensionDesignTokensCollectionTokenToCssVariableDeclaration(
  token: DimensionDesignTokensCollectionToken,
  options?: DimensionDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    dimensionDesignTokensCollectionTokenValueToCssValue,
    options,
  );
}
