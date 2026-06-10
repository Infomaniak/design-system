import type { StrokeStyleDesignTokensCollectionToken } from '../../../../../../token/types/composite/stroke-style/stroke-style-design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import {
  strokeStyleDesignTokensCollectionTokenValueToKotlinValue,
  type StrokeStyleDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './value/stroke-style-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface StrokeStyleDesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
    StrokeStyleDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function strokeStyleDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: StrokeStyleDesignTokensCollectionToken,
  options?: StrokeStyleDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: StrokeStyleDesignTokensCollectionTokenValue): never =>
      strokeStyleDesignTokensCollectionTokenValueToKotlinValue(value, options),
    options,
  );
}
