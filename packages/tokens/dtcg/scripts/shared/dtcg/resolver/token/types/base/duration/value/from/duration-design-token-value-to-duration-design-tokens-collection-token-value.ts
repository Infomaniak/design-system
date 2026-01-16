import { resolveValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { DurationDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/duration/value/duration-design-token-value.ts';
import type { DurationDesignTokensCollectionTokenValue } from '../duration-design-tokens-collection-token-value.ts';

export function durationDesignTokenValueToDurationDesignTokensCollectionTokenValue(
  $value: DurationDesignTokenValue,
  root: unknown,
): DurationDesignTokensCollectionTokenValue {
  return {
    value: resolveValueOrJsonReference($value.value, root),
    unit: resolveValueOrJsonReference($value.unit, root),
  };
}
