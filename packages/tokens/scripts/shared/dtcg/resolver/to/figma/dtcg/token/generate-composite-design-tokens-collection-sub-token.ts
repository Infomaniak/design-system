import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { CurlyReference } from '../../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type {
  DesignTokensCollectionTokenWithType,
  GenericDesignTokensCollectionToken,
  InferDesignTokensCollectionTokenValue,
} from '../../../../token/design-tokens-collection-token.ts';
import {
  type DesignTokensCollectionTokenMode,
  getDesignTokensCollectionTokenMode,
} from './extensions/get-design-tokens-collection-token-mode.ts';

export type CompositeDesignTokensCollectionSubToken<
  GCompositeToken extends GenericDesignTokensCollectionToken,
  GSubTokenKey extends Extract<
    keyof InferDesignTokensCollectionTokenValue<GCompositeToken>,
    string
  >,
  GSubTokenType extends string,
> = DesignTokensCollectionTokenWithType<
  GSubTokenType,
  Exclude<InferDesignTokensCollectionTokenValue<GCompositeToken>[GSubTokenKey], CurlyReference>
>;

export function generateCompositeDesignTokensCollectionSubToken<
  GCompositeToken extends GenericDesignTokensCollectionToken,
  GSubTokenKey extends Extract<
    keyof InferDesignTokensCollectionTokenValue<GCompositeToken>,
    string
  >,
  GSubTokenType extends string,
>(
  compositeToken: GCompositeToken,
  subTokenKey: GSubTokenKey,
  subTokenType: GSubTokenType,
): CompositeDesignTokensCollectionSubToken<GCompositeToken, GSubTokenKey, GSubTokenType> {
  type GCompositeTokenValue = InferDesignTokensCollectionTokenValue<GCompositeToken>;
  type GSubTokenValue = GCompositeTokenValue[GSubTokenKey];

  const mapValueOrCurlyReference = (
    value: ValueOrCurlyReference<GCompositeTokenValue>,
  ): ValueOrCurlyReference<GSubTokenValue> => {
    return isCurlyReference(value)
      ? segmentsReferenceToCurlyReference([
          ...curlyReferenceToSegmentsReference(value),
          subTokenKey,
        ])
      : (value as Record<GSubTokenKey, GCompositeTokenValue>)[subTokenKey];
  };

  let mode: DesignTokensCollectionTokenMode<GCompositeTokenValue> | undefined =
    getDesignTokensCollectionTokenMode<GCompositeTokenValue>(compositeToken);

  if (mode !== undefined) {
    mode = Object.fromEntries(
      Object.entries(mode).map(
        ([key, value]: [string, ValueOrCurlyReference<GCompositeTokenValue>]): [
          string,
          ValueOrCurlyReference<GSubTokenValue>,
        ] => {
          return [key, mapValueOrCurlyReference(value)];
        },
      ),
    ) as DesignTokensCollectionTokenMode<GCompositeTokenValue>;
  }

  return removeUndefinedProperties({
    ...compositeToken,
    type: subTokenType,
    name: [...compositeToken.name, subTokenKey],
    value: mapValueOrCurlyReference(compositeToken.value),
    extensions:
      compositeToken.extensions === undefined
        ? undefined
        : removeUndefinedProperties({
            ...compositeToken.extensions,
            mode,
          }),
  }) as unknown as CompositeDesignTokensCollectionSubToken<
    GCompositeToken,
    GSubTokenKey,
    GSubTokenType
  >;
}
