import type { ValueOrCurlyReference } from '../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../object/object-shadow-design-tokens-collection-token-value.ts';

export type ObjectArrayShadowDesignTokensCollectionTokenValue =
  readonly ValueOrCurlyReference<ObjectShadowDesignTokensCollectionTokenValue>[]; // NOTE: the reference must point to a shadow token
