import type { NumberDesignTokensCollectionToken } from '../../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { SwiftEnumDeclaration } from '../../../../swift-enum-declaration/swift-enum-declaration.ts';
import { designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration } from '../../../design-tokens-collection-token-with-map-value-to-swift-enum-declaration.ts';
import { numberDesignTokensCollectionTokenValueToSwiftValue } from './value/number-design-tokens-collection-token-value-to-swift-value.ts';

export function numberDesignTokensCollectionTokenToSwiftEnumDeclaration(
  token: NumberDesignTokensCollectionToken,
): SwiftEnumDeclaration {
  return designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration(
    token,
    'CGFloat',
    numberDesignTokensCollectionTokenValueToSwiftValue,
  );
}
