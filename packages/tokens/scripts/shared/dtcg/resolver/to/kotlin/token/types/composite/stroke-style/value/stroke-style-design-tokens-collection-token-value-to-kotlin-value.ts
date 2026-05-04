import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import { predefinedStrokeStyleDesignTokenValueToKotlinValue } from './types/predefined/predefined-stroke-style-design-token-value-to-kotlin-value.ts';

export type StrokeStyleDesignTokensCollectionTokenValueToKotlinValueOptions = object;

export function strokeStyleDesignTokensCollectionTokenValueToKotlinValue(
  value: StrokeStyleDesignTokensCollectionTokenValue,
  _options?: StrokeStyleDesignTokensCollectionTokenValueToKotlinValueOptions,
): never {
  if (isPredefinedStrokeStyleDesignTokenValue(value)) {
    return predefinedStrokeStyleDesignTokenValueToKotlinValue(value);
  } else {
    throw new Error('ObjectStrokeStyleDesignTokenValue cannot be converted to KOTLIN value.');
  }
}
