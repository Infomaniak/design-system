import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import type { KotlinVariableDeclarationDpValue } from '../../../../kotlin-variable-declaration/value/built-in/dp/kotlin-variable-declaration-dp-value.ts';
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
    ): KotlinVariableDeclarationDpValue | KotlinVariableDeclarationTextUnitValue => {
      // NOTE: force casting from "px" to "rem" for the fonts
      const name: string = token.name.join('.');
      if (
        /^font\.(?:size|letter-spacing|line-height)\.\w+$/.test(name) ||
        /^text\.\w+\.(?:size|letter-spacing|line-height)$/.test(name)
      ) {
        return dimensionDesignTokensCollectionTokenValueToKotlinValue({
          value: value.value,
          unit: 'rem',
        });
      }
      return dimensionDesignTokensCollectionTokenValueToKotlinValue(value);
    },
    options,
  );
}
