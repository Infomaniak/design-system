import type { ResolvedDesignTokensCollectionToken } from '../../../../../../token/design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import { colorDesignTokensCollectionTokenToColorFigmaDesignToken } from '../base/color.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';
import { strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken } from './stroke-style.ts';

export function borderDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: ResolvedDesignTokensCollectionToken<'border', BorderDesignTokensCollectionTokenValue>,
): FigmaDesignTokensGroup {
  return {
    color: colorDesignTokensCollectionTokenToColorFigmaDesignToken({
      ...token,
      type: 'color',
      value: token.value.color,
    }),
    width: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'dimension',
      value: token.value.width,
    }),
    style: strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken({
      ...token,
      type: 'strokeStyle',
      value: token.value.style,
    }),
  };
}
