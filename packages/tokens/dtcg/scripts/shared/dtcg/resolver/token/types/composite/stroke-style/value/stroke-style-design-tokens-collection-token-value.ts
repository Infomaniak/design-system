import type { PredefinedStrokeStyleDesignTokenValue } from '../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/predefined-stroke-style-design-token-value.ts';
import type { ObjectStrokeStyleDesignTokensCollectionTokenValue } from './types/object/object-stroke-style-design-tokens-collection-token-value.ts';

export type StrokeStyleDesignTokensCollectionTokenValue =
  | PredefinedStrokeStyleDesignTokenValue
  | ObjectStrokeStyleDesignTokensCollectionTokenValue;
