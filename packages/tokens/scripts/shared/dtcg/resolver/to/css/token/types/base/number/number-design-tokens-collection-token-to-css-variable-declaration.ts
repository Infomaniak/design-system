import type { NumberDesignTokensCollectionToken } from '../../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration/css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { numberDesignTokensCollectionTokenValueToCssValue } from './value/number-design-tokens-collection-token-value-to-css-value.ts';

export interface NumberDesignTokensCollectionTokenToCssVariableDeclarationOptions extends DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions {}

export function numberDesignTokensCollectionTokenToCssVariableDeclaration(
  token: NumberDesignTokensCollectionToken,
  options?: NumberDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    numberDesignTokensCollectionTokenValueToCssValue,
    options,
  );
}
