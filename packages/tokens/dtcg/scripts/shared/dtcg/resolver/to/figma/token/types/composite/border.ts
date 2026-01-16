import type { ResolvedDesignTokensCollectionToken } from '../../../../../token/design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../../../../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenToFigmaObject } from '../base/color.ts';
import { dimensionDesignTokensCollectionTokenToFigmaObject } from '../base/dimension.ts';
import { strokeStyleDesignTokensCollectionTokenToFigmaObject } from './stroke-style.ts';

export function borderDesignTokensCollectionTokenToFigmaObject(
  token: ResolvedDesignTokensCollectionToken<'border', BorderDesignTokensCollectionTokenValue>,
): unknown {
  return {
    color: colorDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'color',
      value: token.value.color,
    }),
    width: dimensionDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'dimension',
      value: token.value.width,
    }),
    style: strokeStyleDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'strokeStyle',
      value: token.value.style,
    }),
  };
}
