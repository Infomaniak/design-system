import type { DesignTokensCollectionTokenWithType } from '../../../token/design-tokens-collection-token.ts';
import { valueOrCurlyReferenceToSwiftEnumReference } from '../reference/value-or-curly-reference-to-swift-enum-reference.ts';
import type { SwiftEnumDeclaration } from '../swift-enum-declaration/swift-enum-declaration.ts';
import { designTokenNameSegmentsReferenceToSwiftName } from './name/design-token-name-segments-reference-to-swift-name.ts';

export function designTokensCollectionTokenWithMapValueToSwiftEnumDeclaration<GValue>(
  token: DesignTokensCollectionTokenWithType<string, GValue>,
  type: string,
  mapValue: (value: GValue) => string,
): SwiftEnumDeclaration {
  return {
    name: designTokenNameSegmentsReferenceToSwiftName(token.name, 1),
    type,
    value: valueOrCurlyReferenceToSwiftEnumReference(token.value, mapValue),
    description: token.description,
    deprecated: token.deprecated,
  };
}
