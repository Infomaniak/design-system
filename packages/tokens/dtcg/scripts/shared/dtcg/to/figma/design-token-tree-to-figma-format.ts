import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { resolveDesignToken } from '../../design-token/reference/resolve/token/resolve-design-token.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import type { DesignTokenTreeToFigmaFormatContext } from './design-token-tree-to-figma-format-context.ts';
import { resolvedColorDesignTokenToFigmaObject } from './tokens/base/color.ts';
import { resolvedCubicBezierDesignTokenToFigmaObject } from './tokens/base/cubic-bezier.ts';
import { resolvedDimensionDesignTokenToFigmaObject } from './tokens/base/dimension.ts';
import { resolvedDurationDesignTokenToFigmaObject } from './tokens/base/duration.ts';
import { resolvedFontFamilyDesignTokenToFigmaObject } from './tokens/base/font-family.ts';
import { resolvedFontWeightDesignTokenToFigmaObject } from './tokens/base/font-weight.ts';
import { resolvedNumberDesignTokenToFigmaObject } from './tokens/base/number.ts';
import { borderDesignTokenToFigmaObject } from './tokens/composite/border.ts';
import { resolvedStrokeStyleDesignTokenToFigmaObject } from './tokens/composite/stroke-style.ts';
import { resolvedTransitionDesignTokenToFigmaObject } from './tokens/composite/transition.ts';
import { resolvedTypographyDesignTokenToFigmaObject } from './tokens/composite/typography.ts';

export function designTokenTreeToFigmaFormat(
  tree: DesignTokensTree,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  if (isDesignToken(tree)) {
    const token = resolveDesignToken(tree, ctx.root);

    switch (token.$type) {
      case 'color':
        return resolvedColorDesignTokenToFigmaObject(tree, token, ctx);
      case 'cubicBezier':
        return resolvedCubicBezierDesignTokenToFigmaObject(tree, token, ctx);
      case 'dimension':
        return resolvedDimensionDesignTokenToFigmaObject(tree, token, ctx);
      case 'duration':
        return resolvedDurationDesignTokenToFigmaObject(tree, token, ctx);
      case 'fontFamily':
        return resolvedFontFamilyDesignTokenToFigmaObject(tree, token, ctx);
      case 'fontWeight':
        return resolvedFontWeightDesignTokenToFigmaObject(tree, token, ctx);
      case 'number':
        return resolvedNumberDesignTokenToFigmaObject(tree, token, ctx);

      case 'border':
        return borderDesignTokenToFigmaObject(tree, token, ctx);
      case 'strokeStyle':
        return resolvedStrokeStyleDesignTokenToFigmaObject(tree, token, ctx);
      case 'transition':
        return resolvedTransitionDesignTokenToFigmaObject(tree, token, ctx);
      case 'typography':
        return resolvedTypographyDesignTokenToFigmaObject(tree, token, ctx);
      default:
        throw new Error(`Unsupported token type: ${token.$type}.`);
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
            designTokenTreeToFigmaFormat(
              {
                $description,
                $type,
                $deprecated,
                $extensions,
                ...child,
              },
              ctx,
            ),
          ];
        },
      ),
    );
  }
}
