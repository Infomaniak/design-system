import type { ValueOrDesignTokenReference } from '../../../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { ObjectShadowDesignTokenValue } from '../object/object-shadow-design-token-value.ts';

export type ObjectArrayShadowDesignTokenValue =
  readonly ValueOrDesignTokenReference<ObjectShadowDesignTokenValue>[]; // NOTE: the reference must point to a shadow token
