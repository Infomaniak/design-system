import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import { isColorDesignToken } from '../../design-token/token/types/base/types/color/is-color-design-token.ts';
import { isCubicBezierDesignToken } from '../../design-token/token/types/base/types/cubic-bezier/is-cubic-bezier-design-token.ts';
import { isDimensionDesignToken } from '../../design-token/token/types/base/types/dimension/is-dimension-design-token.ts';
import { isDurationDesignToken } from '../../design-token/token/types/base/types/duration/is-duration-design-token.ts';
import { isFontFamilyDesignToken } from '../../design-token/token/types/base/types/font-family/is-font-family-design-token.ts';
import { isFontWeightDesignToken } from '../../design-token/token/types/base/types/font-weight/is-font-weight-design-token.ts';
import { isNumberDesignToken } from '../../design-token/token/types/base/types/number/is-number-design-token.ts';
import { isBorderDesignToken } from '../../design-token/token/types/composite/types/border/is-border-design-token.ts';
import { isStrokeStyleDesignToken } from '../../design-token/token/types/composite/types/stroke-style/is-stroke-style-design-token.ts';
import { isTransitionDesignToken } from '../../design-token/token/types/composite/types/transition/is-transition-design-token.ts';
import { isTypographyDesignToken } from '../../design-token/token/types/composite/types/typography/is-typography-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import { colorDesignTokenToFigmaObject } from './tokens/base/color-design-token-to-figma-object.ts';
import { cubicBezierDesignTokenToFigmaObject } from './tokens/base/cubic-bezier-design-token-to-figma-object.ts';
import { dimensionDesignTokenToFigmaObject } from './tokens/base/dimension-design-token-to-figma-object.ts';
import { durationDesignTokenToFigmaObject } from './tokens/base/duration-design-token-to-figma-object.ts';
import { fontFamilyDesignTokenToFigmaObject } from './tokens/base/font-family-design-token-to-figma-object.ts';
import { fontWeightDesignTokenToFigmaObject } from './tokens/base/font-weight-design-token-to-figma-object.ts';
import { numberDesignTokenToFigmaObject } from './tokens/base/number-design-token-to-figma-object.ts';
import { borderDesignTokenToFigmaObject } from './tokens/composite/border-design-token-to-figma-object.ts';
import { strokeStyleDesignTokenToFigmaObject } from './tokens/composite/stroke-style-design-token-to-figma-object.ts';
import { transitionDesignTokenToFigmaObject } from './tokens/composite/transition-design-token-to-figma-object.ts';
import { typographyDesignTokenToFigmaObject } from './tokens/composite/typography-design-token-to-figma-object.ts';

export function designTokenTreeToFigmaFormat(tree: DesignTokensTree): any {
  if (isDesignToken(tree)) {
    if (isColorDesignToken(tree)) {
      return colorDesignTokenToFigmaObject(tree);
    } else if (isCubicBezierDesignToken(tree)) {
      return cubicBezierDesignTokenToFigmaObject(tree);
    } else if (isDimensionDesignToken(tree)) {
      return dimensionDesignTokenToFigmaObject(tree);
    } else if (isDurationDesignToken(tree)) {
      return durationDesignTokenToFigmaObject(tree);
    } else if (isFontFamilyDesignToken(tree)) {
      return fontFamilyDesignTokenToFigmaObject(tree);
    } else if (isFontWeightDesignToken(tree)) {
      return fontWeightDesignTokenToFigmaObject(tree);
    } else if (isNumberDesignToken(tree)) {
      return numberDesignTokenToFigmaObject(tree);
    } else if (isBorderDesignToken(tree)) {
      return borderDesignTokenToFigmaObject(tree);
    } else if (isStrokeStyleDesignToken(tree)) {
      return strokeStyleDesignTokenToFigmaObject(tree);
    } else if (isTransitionDesignToken(tree)) {
      return transitionDesignTokenToFigmaObject(tree);
    } else if (isTypographyDesignToken(tree)) {
      return typographyDesignTokenToFigmaObject(tree);
    } else {
      return removeUndefinedProperties(tree);
    }
  } else {
    const {
      $description,
      $type,
      $extends,
      $ref,
      $deprecated,
      $extensions,
      ...children
    }: DesignTokensGroup = tree;

    if ($extends !== undefined || $ref !== undefined) {
      throw new Error('Tree should not have $extends.');
    }

    return Object.fromEntries(
      Object.entries(children).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          return [
            name,
            designTokenTreeToFigmaFormat({
              $description,
              $type,
              $deprecated,
              $extensions,
              ...child,
            }),
          ];
        },
      ),
    );
  }
}
