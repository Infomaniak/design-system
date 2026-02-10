import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { StrokeStyleDesignTokensCollectionToken } from '../../../../../../token/types/composite/stroke-style/stroke-style-design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import type { StringFigmaDesignToken } from '../../../../figma/token/types/string/string-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken(
  token: StrokeStyleDesignTokensCollectionToken,
): StringFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'string',
    strokeStyleDesignTokensCollectionTokenValueToFigmaValue,
  );
}

export function strokeStyleDesignTokensCollectionTokenValueToFigmaValue(
  value: StrokeStyleDesignTokensCollectionTokenValue,
): string {
  if (isPredefinedStrokeStyleDesignTokenValue(value)) {
    return value;
  } else {
    throw new Error('Unsupported ObjectStrokeStyleDesignTokenValue.');
  }
}
