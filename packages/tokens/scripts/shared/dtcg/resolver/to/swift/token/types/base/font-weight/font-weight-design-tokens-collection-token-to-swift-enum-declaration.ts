import type { FontWeightDesignTokensCollectionToken } from '../../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { SwiftEnumDeclaration } from '../../../../swift-enum-declaration/swift-enum-declaration.ts';
import { designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration } from '../../../design-tokens-collection-token-with-map-value-to-swift-enum-declaration.ts';
import { fontWeightDesignTokensCollectionTokenValueToSwiftValue } from './value/font-weight-design-tokens-collection-token-value-to-swift-value.ts';

export function fontWeightDesignTokensCollectionTokenToSwiftEnumDeclaration(
  token: FontWeightDesignTokensCollectionToken,
): SwiftEnumDeclaration {
  return designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration(
    token,
    'Font.Weight',
    fontWeightDesignTokensCollectionTokenValueToSwiftValue,
  );
}
