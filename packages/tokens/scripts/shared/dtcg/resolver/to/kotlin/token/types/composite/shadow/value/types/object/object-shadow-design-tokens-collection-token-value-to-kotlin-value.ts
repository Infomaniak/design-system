import { dedent } from '../../../../../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/composite/shadow/value/types/object/object-shadow-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationShadowValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/shadow/kotlin-variable-declaration-shadow-value.ts';
import { convertKotlinTextUnitToDp } from '../../../../../../../kotlin-variable-declaration/value/built-in/text-unit/to/convert-kotlin-text-unit-to-dp.ts';
import type { KotlinVariableDeclarationValue } from '../../../../../../../kotlin-variable-declaration/value/kotlin-variable-declaration-value.ts';
import {
  valueOrCurlyReferenceToKotlinVariableReference,
  type ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
} from '../../../../../../../reference/value-or-curly-reference-to-kotlin-variable-reference.ts';
import { colorDesignTokensCollectionTokenValueToKotlinValue } from '../../../../../base/color/value/color-design-tokens-collection-token-value-to-kotlin-value.ts';
import { dimensionDesignTokensCollectionTokenValueToKotlinValue } from '../../../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-kotlin-value.ts';

export type ObjectShadowDesignTokensCollectionTokenValueToKotlinValueOptions =
  ValueOrCurlyReferenceToKotlinVariableReferenceOptions;

export function objectShadowDesignTokensCollectionTokenValueToKotlinValue(
  value: ObjectShadowDesignTokensCollectionTokenValue,
  options?: ObjectShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
): KotlinVariableDeclarationShadowValue {
  const color: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.color,
    colorDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  let offsetX: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.offsetX,
    dimensionDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  if (offsetX.type === 'TextUnit') {
    offsetX = convertKotlinTextUnitToDp(offsetX);
  }

  let offsetY: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.offsetY,
    dimensionDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  if (offsetY.type === 'TextUnit') {
    offsetY = convertKotlinTextUnitToDp(offsetY);
  }

  let blur: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.blur,
    dimensionDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  if (blur.type === 'TextUnit') {
    blur = convertKotlinTextUnitToDp(blur);
  }

  let spread: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.spread,
    dimensionDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  if (spread.type === 'TextUnit') {
    spread = convertKotlinTextUnitToDp(spread);
  }

  return {
    type: 'Shadow',
    value: dedent`
      Shadow(
        color = ${color.value},
        offset = DpOffset(${offsetX.value}, ${offsetY.value}),
        radius = ${blur.value},
        spread = ${spread.value}
      )
    `,
  };
}
