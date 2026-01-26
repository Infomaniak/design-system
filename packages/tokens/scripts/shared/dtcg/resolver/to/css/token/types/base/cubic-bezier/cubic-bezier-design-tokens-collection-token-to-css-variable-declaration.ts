import type { CubicBezierDesignTokensCollectionToken } from '../../../../../../token/types/base/cubic-bezier/cubic-bezier-design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration/css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { cubicBezierDesignTokensCollectionTokenValueToCssValue } from './value/cubic-bezier-design-tokens-collection-token-value-to-css-value.ts';

export interface CubicBezierDesignTokensCollectionTokenToCssVariableDeclarationOptions extends DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions {}

export function cubicBezierDesignTokensCollectionTokenToCssVariableDeclaration(
  token: CubicBezierDesignTokensCollectionToken,
  options?: CubicBezierDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    cubicBezierDesignTokensCollectionTokenValueToCssValue,
    options,
  );
}
