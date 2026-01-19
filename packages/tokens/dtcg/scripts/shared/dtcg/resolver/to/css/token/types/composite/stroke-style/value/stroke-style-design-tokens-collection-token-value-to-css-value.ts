import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import { predefinedStrokeStyleDesignTokenValueToCssValue } from './types/predefined/predefined-stroke-style-design-token-value-to-css-value.ts';

export interface StrokeStyleDesignTokensCollectionTokenValueToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition
 */
export function strokeStyleDesignTokensCollectionTokenValueToCssValue(
  value: StrokeStyleDesignTokensCollectionTokenValue,
  _options?: StrokeStyleDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  if (isPredefinedStrokeStyleDesignTokenValue(value)) {
    return predefinedStrokeStyleDesignTokenValueToCssValue(value);
  } else {
    throw new Error('ObjectStrokeStyleDesignTokenValue cannot be converted to CSS value.');
  }
}
