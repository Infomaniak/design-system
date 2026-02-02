import type { ValueOrCurlyReference } from '../../../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';

export function getTokenValueByTheme(
  token: GenericDesignTokensCollectionToken,
  theme: string,
): ValueOrCurlyReference<unknown> {
  return (token.extensions?.['theme'] as any)?.[theme] ?? token.value;
}
