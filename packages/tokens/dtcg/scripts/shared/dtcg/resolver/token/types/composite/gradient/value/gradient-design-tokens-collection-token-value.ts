import type { ValueOrCurlyReference } from '../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from './members/object/object-gradient-design-tokens-collection-token-value.ts';

export type GradientDesignTokensCollectionTokenValue =
  readonly ValueOrCurlyReference<ObjectGradientDesignTokensCollectionTokenValue>[];
