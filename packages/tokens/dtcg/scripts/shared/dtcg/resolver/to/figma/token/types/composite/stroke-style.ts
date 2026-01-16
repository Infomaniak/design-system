import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { StrokeStyleDesignTokensCollectionToken } from '../../../../../token/types/composite/stroke-style/stroke-style-design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function strokeStyleDesignTokensCollectionTokenToFigmaObject(
  token: StrokeStyleDesignTokensCollectionToken,
): unknown {
  return {
    $type: 'string',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      strokeStyleDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
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
