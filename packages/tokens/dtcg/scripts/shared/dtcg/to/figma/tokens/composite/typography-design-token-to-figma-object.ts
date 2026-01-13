import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToSegmentsReference } from '../../../../design-token/reference/to/segments-reference/design-token-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../../../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { TypographyDesignToken } from '../../../../design-token/token/types/composite/types/typography/typography-design-token.ts';
import { dimensionDesignTokenToFigmaObject } from '../base/dimension-design-token-to-figma-object.ts';
import { fontFamilyDesignTokenToFigmaObject } from '../base/font-family-design-token-to-figma-object.ts';
import { fontWeightDesignTokenToFigmaObject } from '../base/font-weight-design-token-to-figma-object.ts';
import { numberDesignTokenToFigmaObject } from '../base/number-design-token-to-figma-object.ts';

export function typographyDesignTokenToFigmaObject({ $value }: TypographyDesignToken): any {
  if (isDesignTokenReference($value)) {
    const reference: SegmentsReference = designTokenReferenceToSegmentsReference($value);

    return {
      fontFamily: {
        $value: segmentsReferenceToCurlyReference([...reference, 'fontFamily']),
      },
      fontSize: {
        $value: segmentsReferenceToCurlyReference([...reference, 'fontSize']),
      },
      fontWeight: {
        $value: segmentsReferenceToCurlyReference([...reference, 'fontWeight']),
      },
      letterSpacing: {
        $value: segmentsReferenceToCurlyReference([...reference, 'letterSpacing']),
      },
      lineHeight: {
        $value: segmentsReferenceToCurlyReference([...reference, 'lineHeight']),
      },
    };
  }

  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } = $value;

  return {
    fontFamily: fontFamilyDesignTokenToFigmaObject({
      $value: fontFamily,
    }),
    fontSize: dimensionDesignTokenToFigmaObject({
      $value: fontSize,
    }),
    fontWeight: fontWeightDesignTokenToFigmaObject({
      $value: fontWeight,
    }),
    letterSpacing: dimensionDesignTokenToFigmaObject({
      $value: letterSpacing,
    }),
    lineHeight: numberDesignTokenToFigmaObject({
      $value: lineHeight,
    }),
  };
}
