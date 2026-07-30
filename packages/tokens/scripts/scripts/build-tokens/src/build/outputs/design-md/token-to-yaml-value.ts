import { isCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { colorDesignTokensCollectionTokenValueToCssValue } from '../../../../../../shared/dtcg/resolver/to/css/token/types/base/color/value/color-design-tokens-collection-token-value-to-css-value.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../../../shared/dtcg/resolver/to/css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import { durationDesignTokensCollectionTokenValueToCssValue } from '../../../../../../shared/dtcg/resolver/to/css/token/types/base/duration/value/duration-design-tokens-collection-token-value-to-css-value.ts';
import { fontFamilyDesignTokensCollectionTokenValueToCssValue } from '../../../../../../shared/dtcg/resolver/to/css/token/types/base/font-family/value/font-family-design-tokens-collection-token-value-to-css-value.ts';
import { fontWeightDesignTokensCollectionTokenValueToCssValue } from '../../../../../../shared/dtcg/resolver/to/css/token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value-to-css-value.ts';
import { numberDesignTokensCollectionTokenValueToCssValue } from '../../../../../../shared/dtcg/resolver/to/css/token/types/base/number/value/number-design-tokens-collection-token-value-to-css-value.ts';
import type { GenericResolvedDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';

/*-- deepResolveValue --*/

/**
 * Recursively resolves curly references within a value by looking them up in the collection.
 * Handles arrays and plain objects recursively, returning fully-resolved concrete values.
 */
export function deepResolveValue(collection: DesignTokensCollection, value: unknown): unknown {
  if (isCurlyReference(value)) {
    const name = DesignTokensCollection.curlyReferenceToArrayDesignTokenName(value);
    const token = collection.get(name);
    const resolved = collection.resolve(token);
    return deepResolveValue(collection, resolved.value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepResolveValue(collection, item));
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map((entry): [string, unknown] => [
        entry[0],
        deepResolveValue(collection, entry[1]),
      ]),
    );
  }

  return value;
}

/*-- formatResolvedValue --*/

function isColorValue(value: Record<string, unknown>): boolean {
  return 'hex' in value && 'components' in value && 'colorSpace' in value;
}

function isDimensionLikeValue(value: Record<string, unknown>): boolean {
  return 'value' in value && 'unit' in value;
}

function innerFormatResolvedValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;

    if (isColorValue(obj)) {
      return colorDesignTokensCollectionTokenValueToCssValue(
        value as Parameters<typeof colorDesignTokensCollectionTokenValueToCssValue>[0],
      );
    }

    if (isDimensionLikeValue(obj)) {
      return dimensionDesignTokensCollectionTokenValueToCssValue(
        value as Parameters<typeof dimensionDesignTokensCollectionTokenValueToCssValue>[0],
      );
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => innerFormatResolvedValue(item)).join(', ');
  }

  return String(value);
}

/*-- resolvedTokenToYamlValue --*/

export function resolvedTokenToYamlValue(
  collection: DesignTokensCollection,
  resolvedToken: GenericResolvedDesignTokensCollectionToken,
): string | Record<string, unknown> {
  const fullyResolved = deepResolveValue(collection, resolvedToken.value);

  switch (resolvedToken.type) {
    case 'color':
      return colorDesignTokensCollectionTokenValueToCssValue(
        fullyResolved as Parameters<typeof colorDesignTokensCollectionTokenValueToCssValue>[0],
      );
    case 'dimension':
      return dimensionDesignTokensCollectionTokenValueToCssValue(
        fullyResolved as Parameters<typeof dimensionDesignTokensCollectionTokenValueToCssValue>[0],
      );
    case 'number': {
      return numberDesignTokensCollectionTokenValueToCssValue(fullyResolved as number);
    }
    case 'fontFamily': {
      return fontFamilyDesignTokensCollectionTokenValueToCssValue(
        fullyResolved as Parameters<typeof fontFamilyDesignTokensCollectionTokenValueToCssValue>[0],
      );
    }
    case 'fontWeight': {
      return fontWeightDesignTokensCollectionTokenValueToCssValue(
        fullyResolved as Parameters<typeof fontWeightDesignTokensCollectionTokenValueToCssValue>[0],
      );
    }
    case 'duration': {
      return durationDesignTokensCollectionTokenValueToCssValue(
        fullyResolved as Parameters<typeof durationDesignTokensCollectionTokenValueToCssValue>[0],
      );
    }
    case 'typography': {
      const source = fullyResolved as Record<string, unknown>;
      const result: Record<string, string> = {
        fontFamily: innerFormatResolvedValue(source['fontFamily']),
        fontSize: innerFormatResolvedValue(source['fontSize']),
        fontWeight: innerFormatResolvedValue(source['fontWeight']),
        lineHeight: innerFormatResolvedValue(source['lineHeight']),
      };
      if (source['letterSpacing'] !== undefined) {
        result['letterSpacing'] = innerFormatResolvedValue(source['letterSpacing']);
      }
      return result;
    }
    case 'shadow': {
      const source = fullyResolved as Record<string, unknown> | Record<string, unknown>[];
      if (Array.isArray(source)) {
        return source.map((item: Record<string, unknown>): Record<string, string | boolean> => ({
          offsetX: innerFormatResolvedValue(item['offsetX'] ?? 0),
          offsetY: innerFormatResolvedValue(item['offsetY'] ?? 0),
          blur: innerFormatResolvedValue(item['blur'] ?? 0),
          spread: innerFormatResolvedValue(item['spread'] ?? 0),
          color: innerFormatResolvedValue(item['color'] ?? '#000000'),
          inset: Boolean(item['inset']),
        })) as unknown as Record<string, unknown>;
      }
      return {
        offsetX: innerFormatResolvedValue(source['offsetX'] ?? 0),
        offsetY: innerFormatResolvedValue(source['offsetY'] ?? 0),
        blur: innerFormatResolvedValue(source['blur'] ?? 0),
        spread: innerFormatResolvedValue(source['spread'] ?? 0),
        color: innerFormatResolvedValue(source['color'] ?? '#000000'),
        inset: Boolean(source['inset']),
      };
    }
    default:
      return String(fullyResolved);
  }
}

/*-- resolvedTokenToString --*/

export function resolvedTokenToString(
  collection: DesignTokensCollection,
  resolvedToken: GenericResolvedDesignTokensCollectionToken,
): string {
  const tokenType = resolvedToken.type;

  if (tokenType === 'typography') {
    const resolvedValue = deepResolveValue(collection, resolvedToken.value) as Record<
      string,
      unknown
    >;
    const parts = [
      innerFormatResolvedValue(resolvedValue['fontWeight']),
      `${innerFormatResolvedValue(resolvedValue['fontSize'])}/${innerFormatResolvedValue(resolvedValue['lineHeight'])}`,
      innerFormatResolvedValue(resolvedValue['fontFamily']),
    ];
    return parts.join(' ');
  }

  if (tokenType === 'shadow') {
    const resolvedValue = deepResolveValue(collection, resolvedToken.value) as
      Record<string, unknown> | Record<string, unknown>[];

    if (Array.isArray(resolvedValue)) {
      return resolvedValue
        .map((shadow) => {
          const parts = [
            innerFormatResolvedValue(shadow['offsetX'] ?? 0),
            innerFormatResolvedValue(shadow['offsetY'] ?? 0),
            innerFormatResolvedValue(shadow['blur'] ?? 0),
            innerFormatResolvedValue(shadow['spread'] ?? 0),
            innerFormatResolvedValue(shadow['color'] ?? '#000000'),
            shadow['inset'] ? 'inset' : '',
          ].filter(Boolean);
          return parts.join(' ');
        })
        .join(', ');
    }

    const parts = [
      innerFormatResolvedValue(resolvedValue['offsetX'] ?? 0),
      innerFormatResolvedValue(resolvedValue['offsetY'] ?? 0),
      innerFormatResolvedValue(resolvedValue['blur'] ?? 0),
      innerFormatResolvedValue(resolvedValue['spread'] ?? 0),
      innerFormatResolvedValue(resolvedValue['color'] ?? '#000000'),
      resolvedValue['inset'] ? 'inset' : '',
    ].filter(Boolean);
    return parts.join(' ');
  }

  return resolvedTokenToYamlValue(collection, resolvedToken) as string;
}
