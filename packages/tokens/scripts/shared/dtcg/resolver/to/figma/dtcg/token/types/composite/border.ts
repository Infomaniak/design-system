import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { BorderDesignTokensCollectionToken } from '../../../../../../token/types/composite/border/border-design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import type { ColorFigmaDesignToken } from '../../../../figma/token/types/color/color-figma-design-token.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import type { StringFigmaDesignToken } from '../../../../figma/token/types/string/string-figma-design-token.ts';
import { compositeDesignTokensCollectionTokenToFigmaDesignToken } from '../../composite-design-tokens-collection-token-to-figma-design-token.ts';
import { colorDesignTokensCollectionTokenToColorFigmaDesignToken } from '../base/color.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';
import { strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken } from './stroke-style.ts';

export function borderDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: BorderDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  return compositeDesignTokensCollectionTokenToFigmaDesignToken(token, {
    color: (
      value: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue>,
    ): ColorFigmaDesignToken =>
      colorDesignTokensCollectionTokenToColorFigmaDesignToken({
        ...token,
        type: 'color',
        value,
      }),
    width: (
      value: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>,
    ): NumberFigmaDesignToken =>
      dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'dimension',
        value,
      }),
    style: (
      value: ValueOrCurlyReference<StrokeStyleDesignTokensCollectionTokenValue>,
    ): StringFigmaDesignToken =>
      strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken({
        ...token,
        type: 'strokeStyle',
        value,
      }),
  });
}
