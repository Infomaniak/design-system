import type { ValueOrDesignTokenReference } from '../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { ObjectGradientDesignTokenValue } from './members/object/object-gradient-design-token-value.ts';

export type GradientDesignTokenValue =
  readonly ValueOrDesignTokenReference<ObjectGradientDesignTokenValue>[]; // NOTE: the reference must point to a gradient token
