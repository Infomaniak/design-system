import type { DesignTokensCollectionTokenWithType } from '../../../../../../token/design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionToken } from '../../../../../../token/types/composite/shadow/shadow-design-tokens-collection-token.ts';
import { isObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/shadow/value/types/object/is-object-shadow-design-tokens-collection-token-value.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/shadow/value/types/object/object-shadow-design-tokens-collection-token-value.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import { generateCompositeDesignTokensCollectionSubToken } from '../../generate-composite-design-tokens-collection-sub-token.ts';
import { colorDesignTokensCollectionTokenToColorFigmaDesignToken } from '../base/color.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';

export function shadowDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: ShadowDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  if (!isObjectShadowDesignTokensCollectionTokenValue(token.value)) {
    throw new Error('Shadow arrays are not supported yet by figma.');
  }

  const objectToken = token as DesignTokensCollectionTokenWithType<
    'shadow',
    ObjectShadowDesignTokensCollectionTokenValue
  >;

  return {
    offsetX: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(objectToken, 'offsetX', 'dimension'),
    ),
    offsetY: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(objectToken, 'offsetY', 'dimension'),
    ),
    blur: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(objectToken, 'blur', 'dimension'),
    ),
    spread: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(objectToken, 'spread', 'dimension'),
    ),
    color: colorDesignTokensCollectionTokenToColorFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(objectToken, 'color', 'color'),
    ),
  };
}
