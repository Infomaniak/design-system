import type { DesignTokenReference } from '../../../../reference/design-token-reference.ts';
import type { CubicBezierDesignTokenValue } from '../../cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { DurationDesignTokenValue } from '../../duration/value/duration-design-token-value.ts';

export interface TransitionDesignTokenValue {
  readonly duration: DurationDesignTokenValue | DesignTokenReference;
  readonly delay: DurationDesignTokenValue | DesignTokenReference;
  readonly timingFunction: CubicBezierDesignTokenValue | DesignTokenReference;
}
