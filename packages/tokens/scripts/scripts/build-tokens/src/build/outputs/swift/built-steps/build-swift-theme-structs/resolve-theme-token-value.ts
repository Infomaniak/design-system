import { isCurlyReference } from '../../../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../../../../shared/dtcg/design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T1_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { tokenToSwiftValue } from '../../swift-tokens-format.ts';

const MAX_REFERENCE_DEPTH = 32;

export interface ThemeTokenResolutionContext {
  readonly productCollection: DesignTokensCollection;
  readonly lightCollection: DesignTokensCollection;
  readonly darkCollection: DesignTokensCollection;
  readonly rawTokensPrefix: string;
}

const THEME_LIGHT_PATH_FRAGMENT = 'theme/light';
const THEME_DARK_PATH_FRAGMENT = 'theme/dark';

function chaseToT1Token(
  startName: ArrayDesignTokenName,
  themeCollection: DesignTokensCollection,
  themePathFragment: string,
  { productCollection }: ThemeTokenResolutionContext,
): GenericDesignTokensCollectionToken {
  let current = startName;

  for (let depth = 0; depth < MAX_REFERENCE_DEPTH; depth++) {
    const themeToken = themeCollection.has(current) ? themeCollection.get(current) : undefined;
    const isThemeOverridden =
      themeToken?.files.some((file: string): boolean => file.includes(themePathFragment)) ?? false;
    const token = isThemeOverridden ? themeToken! : productCollection.get(current);

    if (token.files.some((file: string): boolean => file.includes(T1_DIRECTORY_NAME))) {
      return token;
    }

    const value = token.value;

    if (!isCurlyReference(value)) {
      throw new Error(
        `Token ${current.join('.')} has a literal value and cannot be resolved to a T1 token`,
      );
    }

    current = curlyReferenceToSegmentsReference(value);
  }

  throw new Error(`Reference chain too deep for token ${startName.join('.')}`);
}

export function resolveThemeTokenSwiftValue(
  name: ArrayDesignTokenName,
  swiftType: string,
  context: ThemeTokenResolutionContext,
): string {
  const { rawTokensPrefix } = context;

  if (swiftType === 'SwiftUI.Color') {
    const lightT1 = chaseToT1Token(
      name,
      context.lightCollection,
      THEME_LIGHT_PATH_FRAGMENT,
      context,
    );
    const darkT1 = chaseToT1Token(name, context.darkCollection, THEME_DARK_PATH_FRAGMENT, context);

    const light = tokenToSwiftValue(rawTokensPrefix, lightT1);
    const dark = tokenToSwiftValue(rawTokensPrefix, darkT1);

    return `SwiftUI.Color(light: ${light}, dark: ${dark})`;
  }

  const t1Token = chaseToT1Token(name, context.lightCollection, THEME_LIGHT_PATH_FRAGMENT, context);
  const value = tokenToSwiftValue(rawTokensPrefix, t1Token);

  if (swiftType === 'RoundedRectangle') {
    return `RoundedRectangle(cornerRadius: ${value})`;
  }

  return value;
}
