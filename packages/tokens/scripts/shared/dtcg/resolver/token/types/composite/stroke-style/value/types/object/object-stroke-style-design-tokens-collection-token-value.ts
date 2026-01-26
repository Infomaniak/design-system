import type { StrokeStyleDesignTokenValueLineCap } from '../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/members/line-cap/stroke-style-design-token-value-line-cap.ts';
import type { StrokeStyleDesignTokensCollectionTokenValueDashArray } from './members/dash-array/stroke-style-design-tokens-collection-token-value-dash-array.ts';

export interface ObjectStrokeStyleDesignTokensCollectionTokenValue {
  readonly dashArray: StrokeStyleDesignTokensCollectionTokenValueDashArray;
  readonly lineCap: StrokeStyleDesignTokenValueLineCap;
}
