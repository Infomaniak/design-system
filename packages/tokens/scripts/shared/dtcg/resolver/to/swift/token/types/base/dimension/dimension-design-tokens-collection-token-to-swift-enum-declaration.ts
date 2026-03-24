import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { SwiftEnumDeclaration } from '../../../../swift-enum-declaration/swift-enum-declaration.ts';
import { designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration } from '../../../design-tokens-collection-token-with-map-value-to-swift-enum-declaration.ts';
import { dimensionDesignTokensCollectionTokenValueToSwiftValue } from './value/dimension-design-tokens-collection-token-value-to-swift-value.ts';

export function dimensionDesignTokensCollectionTokenToSwiftEnumDeclaration(
  token: DimensionDesignTokensCollectionToken,
): SwiftEnumDeclaration {
  console.log(token);
  return designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration(
    token,
    'CGFloat',
    dimensionDesignTokensCollectionTokenValueToSwiftValue,
  );
}
