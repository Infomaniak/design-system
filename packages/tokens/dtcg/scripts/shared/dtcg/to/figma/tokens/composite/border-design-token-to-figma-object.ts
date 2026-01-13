import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToSegmentsReference } from '../../../../design-token/reference/to/segments-reference/design-token-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../../../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { BorderDesignToken } from '../../../../design-token/token/types/composite/types/border/border-design-token.ts';
import { colorDesignTokenToFigmaObject } from '../base/color-design-token-to-figma-object.ts';
import { dimensionDesignTokenToFigmaObject } from '../base/dimension-design-token-to-figma-object.ts';
import { strokeStyleDesignTokenToFigmaObject } from './stroke-style-design-token-to-figma-object.ts';

export function borderDesignTokenToFigmaObject({ $value }: BorderDesignToken): any {
  if (isDesignTokenReference($value)) {
    const reference: SegmentsReference = designTokenReferenceToSegmentsReference($value);

    return {
      color: {
        $value: segmentsReferenceToCurlyReference([...reference, 'color']),
      },
      width: {
        $value: segmentsReferenceToCurlyReference([...reference, 'width']),
      },
      style: {
        $value: segmentsReferenceToCurlyReference([...reference, 'style']),
      },
    };
  }

  const { color, width, style } = $value;

  return {
    color: colorDesignTokenToFigmaObject({
      $value: color,
    }),
    width: dimensionDesignTokenToFigmaObject({
      $value: width,
    }),
    style: strokeStyleDesignTokenToFigmaObject({
      $value: style,
    }),
  };
}
