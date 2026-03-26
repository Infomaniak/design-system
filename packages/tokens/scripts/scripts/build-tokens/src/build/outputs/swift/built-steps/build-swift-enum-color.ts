import { isCurlyReference } from '../../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../../../shared/dtcg/design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { SegmentsReference } from '../../../../../../../shared/dtcg/design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../../../shared/dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { DesignTokensCollection } from '../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { SwiftEnumDeclaration } from '../../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/swift-enum-declaration.ts';
import { designTokenNameSegmentsReferenceToSwiftName } from '../../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../shared/dtcg/resolver/token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { BuildSwiftEnumColorOptions } from './build-swift-enum.ts';

export interface BuildSwiftEnumColorOptions {
  readonly token: GenericDesignTokensCollectionToken;
  readonly lightThemeCollection: DesignTokensCollection;
  readonly darkThemeCollection: DesignTokensCollection;
  readonly t1ColorTokenNameToColorsetName: Map<string, string>;
}

export async function buildSwiftEnumColor({
  token,
  lightThemeCollection,
  darkThemeCollection,
  t1ColorTokenNameToColorsetName,
}: BuildSwiftEnumColorOptions): Promise<SwiftEnumDeclaration | null> {
  const lightThemeValue: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue> =
    lightThemeCollection.has(token.name) ? lightThemeCollection.get(token.name).value : token.value;

  const darkThemeValue: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue> =
    darkThemeCollection.has(token.name) ? darkThemeCollection.get(token.name).value : token.value;

  if (!isCurlyReference(lightThemeValue)) {
    throw new Error(
      `Token ${segmentsReferenceToCurlyReference(token.name)} with theme=light is not a curly reference`,
    );
  }

  if (!isCurlyReference(darkThemeValue)) {
    throw new Error(
      `Token ${segmentsReferenceToCurlyReference(token.name)} with theme=dark is not a curly reference`,
    );
  }

  const lightReference: SegmentsReference = curlyReferenceToSegmentsReference(lightThemeValue);

  const darkReference: SegmentsReference = curlyReferenceToSegmentsReference(darkThemeValue);

  const lightColorsetName: string | undefined = t1ColorTokenNameToColorsetName.get(
    JSON.stringify(lightReference),
  );

  const darkColorsetName: string | undefined = t1ColorTokenNameToColorsetName.get(
    JSON.stringify(darkReference),
  );

  if (lightColorsetName === undefined || darkColorsetName === undefined) {
    // not pointing on a t1
    return null;
  }

  return {
    name: designTokenNameSegmentsReferenceToSwiftName(token.name),
    type: 'Color',
    value: `Color(light: Color("${lightColorsetName}"), dark: Color("${darkColorsetName}"))`,
  };
}
