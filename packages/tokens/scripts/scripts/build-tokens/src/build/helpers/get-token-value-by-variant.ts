import type { ValueOrCurlyReference } from '../../../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';

export function getTokenValueByVariant(
  token: GenericDesignTokensCollectionToken,
  variant: string,
): ValueOrCurlyReference<unknown> | undefined {
  return (token.extensions?.['variant'] as any)?.[variant];
}
