import type { ShadowDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/shadow/value/shadow-design-tokens-collection-token-value.ts';
import { isObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/shadow/value/types/object/is-object-shadow-design-tokens-collection-token-value.ts';
import {
  objectArrayShadowDesignTokensCollectionTokenValueToCssValue,
  type ObjectArrayShadowDesignTokensCollectionTokenValueToCssValueOptions,
} from './types/object-array/object-array-shadow-design-tokens-collection-token-value-to-css-value.ts';
import {
  objectShadowDesignTokensCollectionTokenValueToCssValue,
  type ObjectShadowDesignTokensCollectionTokenValueToCssValueOptions,
} from './types/object/object-shadow-design-tokens-collection-token-value-to-css-value.ts';

export interface ShadowDesignTokensCollectionTokenValueToCssValueOptions
  extends
    ObjectShadowDesignTokensCollectionTokenValueToCssValueOptions,
    ObjectArrayShadowDesignTokensCollectionTokenValueToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow
 */
export function shadowDesignTokensCollectionTokenValueToCssValue(
  value: ShadowDesignTokensCollectionTokenValue,
  options?: ShadowDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return isObjectShadowDesignTokensCollectionTokenValue(value)
    ? objectShadowDesignTokensCollectionTokenValueToCssValue(value, options)
    : objectArrayShadowDesignTokensCollectionTokenValueToCssValue(value, options);
}
