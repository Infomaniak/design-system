import type { BorderDesignTokensCollectionToken } from '../../../../../../token/types/composite/border/border-design-tokens-collection-token.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import { generateCompositeDesignTokensCollectionSubToken } from '../../generate-composite-design-tokens-collection-sub-token.ts';
import { colorDesignTokensCollectionTokenToColorFigmaDesignToken } from '../base/color.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';
import { strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken } from './stroke-style.ts';

export function borderDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: BorderDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  return {
    color: colorDesignTokensCollectionTokenToColorFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'color', 'color'),
    ),
    width: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'width', 'dimension'),
    ),
    style: strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'style', 'strokeStyle'),
    ),
  };
}
