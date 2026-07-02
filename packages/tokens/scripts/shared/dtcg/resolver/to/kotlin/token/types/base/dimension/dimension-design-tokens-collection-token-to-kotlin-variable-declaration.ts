import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  isKotlinVariableDeclarationDpValue,
  type KotlinVariableDeclarationDpValue,
} from '../../../../kotlin-variable-declaration/value/built-in/dp/kotlin-variable-declaration-dp-value.ts';
import { convertKotlinDpToShapeRoundedCornerShape } from '../../../../kotlin-variable-declaration/value/built-in/dp/to/convert-kotlin-dp-to-shape-rounded-corner-shape.ts';
import type { KotlinVariableDeclarationShapeValue } from '../../../../kotlin-variable-declaration/value/built-in/shape/kotlin-variable-declaration-shape-value.ts';
import type { KotlinVariableDeclarationTextUnitValue } from '../../../../kotlin-variable-declaration/value/built-in/text-unit/kotlin-variable-declaration-text-unit-value.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import { dimensionDesignTokensCollectionTokenValueToKotlinValue } from './value/dimension-design-tokens-collection-token-value-to-kotlin-value.ts';

export type DimensionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
  DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions;

export function dimensionDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: DimensionDesignTokensCollectionToken,
  options?: DimensionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (
      value: DimensionDesignTokensCollectionTokenValue,
    ):
      | KotlinVariableDeclarationDpValue
      | KotlinVariableDeclarationTextUnitValue
      | KotlinVariableDeclarationShapeValue => {
      const name: string = token.name.join('.');

      if (
        /^font\.(?:size|letter-spacing|line-height)\.\w+$/.test(name) ||
        /^text\.\w+\.(?:size|letter-spacing|line-height)$/.test(name)
      ) {
        // NOTE: force casting from "px" to "rem" for the fonts
        return dimensionDesignTokensCollectionTokenValueToKotlinValue({
          value: value.value,
          unit: 'rem',
        });
      }

      if (/^radius\.\w+$/.test(name)) {
        const kotlinVariableDeclaration:
          KotlinVariableDeclarationDpValue | KotlinVariableDeclarationTextUnitValue =
          dimensionDesignTokensCollectionTokenValueToKotlinValue(value);

        if (!isKotlinVariableDeclarationDpValue(kotlinVariableDeclaration)) {
          throw new Error(
            `Expected "Dp" type for "${name}", but got "${kotlinVariableDeclaration.type}".`,
          );
        }

        if (/^radius\.(0|none)$/.test(name)) {
          // NOTE: force casting from "px" to "RectangleShape" for the "none" radius
          return {
            type: 'Shape',
            value: `RectangleShape`,
          };
        }

        if (/^radius\.(1000|full)$/.test(name)) {
          // NOTE: force casting from "px" to "CircleShape" for the "full" radius
          return {
            type: 'Shape',
            value: `CircleShape`,
          };
        }

        // NOTE: force casting from "px" to "RoundedCornerShape" for the radius
        return convertKotlinDpToShapeRoundedCornerShape(kotlinVariableDeclaration);
      }

      return dimensionDesignTokensCollectionTokenValueToKotlinValue(value);
    },
    options,
  );
}
