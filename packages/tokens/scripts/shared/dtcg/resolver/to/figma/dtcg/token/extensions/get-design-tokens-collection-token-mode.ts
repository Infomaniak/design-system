import { isObject } from '../../../../../../../../../../../scripts/helpers/misc/object/is-object.ts';
import type { ValueOrCurlyReference } from '../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../token/design-tokens-collection-token.ts';

export type DesignTokensCollectionTokenMode<GValue> = Record<string, ValueOrCurlyReference<GValue>>;

export function getDesignTokensCollectionTokenMode<GValue>(
  token: GenericDesignTokensCollectionToken,
): DesignTokensCollectionTokenMode<GValue> | undefined {
  return token.extensions !== undefined &&
    Reflect.has(token.extensions, 'mode') &&
    isObject(Reflect.get(token.extensions, 'mode'))
    ? (Reflect.get(token.extensions, 'mode') as DesignTokensCollectionTokenMode<GValue>)
    : undefined;
}
