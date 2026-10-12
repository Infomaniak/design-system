import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { ColorDesignTokensCollectionToken } from '../../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration/css-variable-declaration.ts';
import { valueOrCurlyReferenceToCssVariableReference } from '../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { numberDesignTokensCollectionTokenValueToCssValue } from '../number/value/number-design-tokens-collection-token-value-to-css-value.ts';
import {
  colorDesignTokensCollectionTokenValueToCssValue,
  type ColorDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/color-design-tokens-collection-token-value-to-css-value.ts';

export interface ColorDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    ColorDesignTokensCollectionTokenValueToCssValueOptions {}

export function colorDesignTokensCollectionTokenToCssVariableDeclaration(
  token: ColorDesignTokensCollectionToken,
  options?: ColorDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return {
    ...designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
      token,
      (value: ColorDesignTokensCollectionTokenValue): string =>
        colorDesignTokensCollectionTokenValueToCssValue(value, options),
      options,
    ),
    derived: [
      designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
        generateSubChannelToken(token, 'a'),
        (value: ColorDesignTokensCollectionTokenValue): string =>
          /**
           * NOTE: Curly reference is not official
           */
          valueOrCurlyReferenceToCssVariableReference(
            value.alpha ?? 1,
            numberDesignTokensCollectionTokenValueToCssValue,
            options,
          ),
        options,
      ),
    ],
  };
}

function generateSubChannelToken(
  token: ColorDesignTokensCollectionToken,
  channel: 'r' | 'g' | 'b' | 'a',
): ColorDesignTokensCollectionToken {
  return {
    ...token,
    value: isCurlyReference(token.value)
      ? segmentsReferenceToCurlyReference([
          ...curlyReferenceToSegmentsReference(token.value),
          channel,
        ])
      : token.value,
    name: [...token.name, channel],
    description: undefined,
  };
}
