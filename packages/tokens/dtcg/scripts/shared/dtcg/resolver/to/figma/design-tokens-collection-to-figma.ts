import { DesignTokensCollection } from '../../design-tokens-collection.ts';
import type {
  GenericResolvedDesignTokensCollectionToken,
  ResolvedDesignTokensCollectionToken,
} from '../../token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../token/name/array-design-token-name.ts';
import type { ColorDesignTokensCollectionToken } from '../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { CubicBezierDesignTokensCollectionToken } from '../../token/types/base/cubic-bezier/cubic-bezier-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionToken } from '../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DurationDesignTokensCollectionToken } from '../../token/types/base/duration/duration-design-tokens-collection-token.ts';
import type { FontFamilyDesignTokensCollectionToken } from '../../token/types/base/font-family/font-family-design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionToken } from '../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionToken } from '../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../../token/types/composite/transition/value/transition-design-tokens-collection-token-value.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenToFigmaObject } from './token/types/base/color.ts';
import { cubicBezierDesignTokensCollectionTokenToFigmaObject } from './token/types/base/cubic-bezier.ts';
import { dimensionDesignTokensCollectionTokenToFigmaObject } from './token/types/base/dimension.ts';
import { durationDesignTokensCollectionTokenToFigmaObject } from './token/types/base/duration.ts';
import { fontFamilyDesignTokensCollectionTokenToFigmaObject } from './token/types/base/font-family.ts';
import { fontWeightDesignTokensCollectionTokenToFigmaObject } from './token/types/base/font-weight.ts';
import { numberDesignTokensCollectionTokenToFigmaObject } from './token/types/base/number.ts';
import { borderDesignTokensCollectionTokenToFigmaObject } from './token/types/composite/border.ts';
import { strokeStyleDesignTokensCollectionTokenToFigmaObject } from './token/types/composite/stroke-style.ts';
import { transitionDesignTokensCollectionTokenToFigmaObject } from './token/types/composite/transition.ts';
import { typographyDesignTokensCollectionTokenToFigmaObject } from './token/types/composite/typography.ts';

export function designTokensCollectionToFigma(collection: DesignTokensCollection): unknown {
  let output: object = {};

  const addToken = (path: ArrayDesignTokenName, figmaToken: unknown): void => {
    if (path.length === 0) {
      throw new Error('Cannot add token to root');
    }

    let node: any = output;
    const last: number = path.length - 1;

    for (let i: number = 0; i < last; i++) {
      const segment: string = path[i];

      if (!Reflect.has(node, segment)) {
        Reflect.set(node, segment, {});
      }

      node = Reflect.get(node, segment);
    }

    Reflect.set(node, path[last], figmaToken);
  };

  for (const token of collection.getMergedTokens()) {
    const resolvedToken: GenericResolvedDesignTokensCollectionToken = collection.resolve(token);

    switch (resolvedToken.type) {
      case 'color':
        addToken(
          token.name,
          colorDesignTokensCollectionTokenToFigmaObject(token as ColorDesignTokensCollectionToken),
        );
        break;
      case 'cubicBezier':
        addToken(
          token.name,
          cubicBezierDesignTokensCollectionTokenToFigmaObject(
            token as CubicBezierDesignTokensCollectionToken,
          ),
        );
        break;
      case 'dimension':
        addToken(
          token.name,
          dimensionDesignTokensCollectionTokenToFigmaObject(
            token as DimensionDesignTokensCollectionToken,
          ),
        );
        break;
      case 'duration':
        addToken(
          token.name,
          durationDesignTokensCollectionTokenToFigmaObject(
            token as DurationDesignTokensCollectionToken,
          ),
        );
        break;
      case 'fontFamily':
        addToken(
          token.name,
          fontFamilyDesignTokensCollectionTokenToFigmaObject(
            token as FontFamilyDesignTokensCollectionToken,
          ),
        );
        break;
      case 'fontWeight':
        addToken(
          token.name,
          fontWeightDesignTokensCollectionTokenToFigmaObject(
            token as FontWeightDesignTokensCollectionToken,
          ),
        );
        break;
      case 'number':
        addToken(
          token.name,
          numberDesignTokensCollectionTokenToFigmaObject(
            token as NumberDesignTokensCollectionToken,
          ),
        );
        break;

      case 'border':
        addToken(
          token.name,
          borderDesignTokensCollectionTokenToFigmaObject(
            resolvedToken as ResolvedDesignTokensCollectionToken<
              'border',
              BorderDesignTokensCollectionTokenValue
            >,
          ),
        );
        break;
      case 'strokeStyle':
        addToken(
          token.name,
          strokeStyleDesignTokensCollectionTokenToFigmaObject(
            resolvedToken as ResolvedDesignTokensCollectionToken<
              'strokeStyle',
              StrokeStyleDesignTokensCollectionTokenValue
            >,
          ),
        );
        break;
      case 'transition':
        addToken(
          token.name,
          transitionDesignTokensCollectionTokenToFigmaObject(
            resolvedToken as ResolvedDesignTokensCollectionToken<
              'transition',
              TransitionDesignTokensCollectionTokenValue
            >,
          ),
        );
        break;
      case 'typography':
        addToken(
          token.name,
          typographyDesignTokensCollectionTokenToFigmaObject(
            resolvedToken as ResolvedDesignTokensCollectionToken<
              'typography',
              TypographyDesignTokensCollectionTokenValue
            >,
          ),
        );
        break;
      default:
        throw new Error(`Unsupported token type: ${resolvedToken.type}.`);
    }
  }

  return output;
}
