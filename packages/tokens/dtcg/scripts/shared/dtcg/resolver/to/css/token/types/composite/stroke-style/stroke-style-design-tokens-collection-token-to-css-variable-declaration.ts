import type { StrokeStyleDesignTokensCollectionToken } from '../../../../../../token/types/composite/stroke-style/stroke-style-design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  strokeStyleDesignTokensCollectionTokenValueToCssValue,
  type StrokeStyleDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/stroke-style-design-tokens-collection-token-value-to-css-value.ts';

export interface StrokeStyleDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    StrokeStyleDesignTokensCollectionTokenValueToCssValueOptions {}

export function strokeStyleDesignTokensCollectionTokenToCssVariableDeclaration(
  token: StrokeStyleDesignTokensCollectionToken,
  options?: StrokeStyleDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: StrokeStyleDesignTokensCollectionTokenValue): string =>
      strokeStyleDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
