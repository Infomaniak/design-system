import type { ValueOrDesignTokenReference } from '../../../../../../reference/value-or/value-or-design-token-reference.js';
import type { CubicBezierDesignTokenValue } from '../../../../base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { DurationDesignTokenValue } from '../../../../base/types/duration/value/duration-design-token-value.ts';

export interface TransitionDesignTokenValue {
  readonly duration: ValueOrDesignTokenReference<DurationDesignTokenValue>;
  readonly delay: ValueOrDesignTokenReference<DurationDesignTokenValue>;
  readonly timingFunction: ValueOrDesignTokenReference<CubicBezierDesignTokenValue>;
}
