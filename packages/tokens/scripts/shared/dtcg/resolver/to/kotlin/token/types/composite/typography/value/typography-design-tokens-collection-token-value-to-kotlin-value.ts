import { dedent } from '../../../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import { convertKotlinDpToTextUnit } from '../../../../../kotlin-variable-declaration/value/built-in/dp/to/convert-kotlin-dp-to-text-unit.ts';
import type { KotlinVariableDeclarationTextStyleValue } from '../../../../../kotlin-variable-declaration/value/built-in/text-style/kotlin-variable-declaration-text-style-value.ts';
import type { KotlinVariableDeclarationValue } from '../../../../../kotlin-variable-declaration/value/kotlin-variable-declaration-value.ts';
import {
  valueOrCurlyReferenceToKotlinVariableReference,
  type ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-kotlin-variable-reference.ts';
import { dimensionDesignTokensCollectionTokenValueToKotlinValue } from '../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-kotlin-value.ts';
import { fontFamilyDesignTokensCollectionTokenValueToKotlinValue } from '../../../base/font-family/value/font-family-design-tokens-collection-token-value-to-kotlin-value.ts';
import { fontWeightDesignTokensCollectionTokenValueToKotlinValue } from '../../../base/font-weight/value/font-weight-design-tokens-collection-token-value-to-kotlin-value.ts';
import { typographyDesignTokensCollectionTokenValueLineHeightToKotlinValue } from './members/line-height/typography-design-tokens-collection-token-value-line-height-to-kotlin-value.ts';

export type TypographyDesignTokensCollectionTokenValueToKotlinValueOptions =
  ValueOrCurlyReferenceToKotlinVariableReferenceOptions;

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/KOTLIN/Reference/Properties/font
 */
export function typographyDesignTokensCollectionTokenValueToKotlinValue(
  value: TypographyDesignTokensCollectionTokenValue,
  options?: TypographyDesignTokensCollectionTokenValueToKotlinValueOptions,
): KotlinVariableDeclarationTextStyleValue {
  const fontFamily: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.fontFamily,
    fontFamilyDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  const fontSize: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.fontSize,
    dimensionDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  const fontWeight: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.fontWeight,
    fontWeightDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  let letterSpacing: KotlinVariableDeclarationValue =
    valueOrCurlyReferenceToKotlinVariableReference(
      value.letterSpacing,
      dimensionDesignTokensCollectionTokenValueToKotlinValue,
      options,
    );

  if (letterSpacing.type === 'Dp') {
    letterSpacing = convertKotlinDpToTextUnit(letterSpacing);
  }

  let lineHeight: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.lineHeight,
    typographyDesignTokensCollectionTokenValueLineHeightToKotlinValue,
    options,
  );

  if (lineHeight.type === 'Dp') {
    lineHeight = convertKotlinDpToTextUnit(lineHeight);
  } else if (lineHeight.type === 'Float') {
    lineHeight = {
      type: 'ref',
      value: 'TextUnit.Unspecified',
    };
  }

  return {
    type: 'TextStyle',
    value: dedent`
      TextStyle(
        fontFamily = ${fontFamily.value},
        fontWeight = ${fontWeight.value},
        fontSize = ${fontSize.value},
        letterSpacing = ${letterSpacing.value},
        lineHeight = ${lineHeight.value},
      )
    `,
  };
}
