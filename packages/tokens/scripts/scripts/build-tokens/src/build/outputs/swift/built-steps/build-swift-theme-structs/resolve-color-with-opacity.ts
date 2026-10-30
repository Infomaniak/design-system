import { isCurlyReference } from '../../../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../../../../shared/dtcg/design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T1_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { tokenToSwiftValue } from '../../swift-tokens-format.ts';

const MAX_REFERENCE_DEPTH = 32;

export interface ColorWithOpacityResolutionContext {
  readonly productCollection: DesignTokensCollection;
  /** Collection used to look up the token first (e.g. light or dark theme) */
  readonly themeCollection: DesignTokensCollection;
  readonly themePathFragment: string;
  readonly rawTokensPrefix: string;
}

/**
 * NOTE: Curly references in color members are not official DTCG.
 */
export function isColorTokenWithReferenceMembers(
  token: GenericDesignTokensCollectionToken,
): boolean {
  const value: unknown = token.value;

  return (
    typeof value === 'object' &&
    value !== null &&
    'colorSpace' in value &&
    (isCurlyReference((value as { components?: unknown }).components) ||
      isCurlyReference((value as { alpha?: unknown }).alpha))
  );
}

function isT1Token(token: GenericDesignTokensCollectionToken): boolean {
  return token.files.some((file: string): boolean => file.includes(T1_DIRECTORY_NAME));
}

function getToken(
  name: ArrayDesignTokenName,
  { productCollection, themeCollection, themePathFragment }: ColorWithOpacityResolutionContext,
): GenericDesignTokensCollectionToken {
  const themeToken = themeCollection.has(name) ? themeCollection.get(name) : undefined;
  const isThemeOverridden =
    themeToken?.files.some((file: string): boolean => file.includes(themePathFragment)) ?? false;

  return isThemeOverridden ? themeToken! : productCollection.get(name);
}

function resolveAlpha(
  alpha: unknown,
  context: ColorWithOpacityResolutionContext,
  tokenName: ArrayDesignTokenName,
): string {
  if (typeof alpha === 'number') {
    return String(alpha);
  }

  let current: unknown = alpha;

  for (let depth = 0; depth < MAX_REFERENCE_DEPTH && isCurlyReference(current); depth++) {
    const token = getToken(curlyReferenceToSegmentsReference(current), context);

    if (isT1Token(token)) {
      return tokenToSwiftValue(context.rawTokensPrefix, token);
    }

    current = token.value;
  }

  throw new Error(`Alpha of token ${tokenName.join('.')} cannot be resolved to a T1 token`);
}

/**
 * Resolves a color token into a Swift expression.
 * Plain T1 colors become `PrimitiveToken.Color.x`, and colors with reference members
 * (components + alpha) become `<components expression>.opacity(<alpha>)`.
 */
export function resolveColorWithOpacitySwiftValue(
  startName: ArrayDesignTokenName,
  context: ColorWithOpacityResolutionContext,
): string {
  return resolveColorSwiftValue(startName, context, 0).value;
}

interface ResolvedSwiftColor {
  readonly value: string;
  /** Name of the token that sets an alpha on the resolved color, if any */
  readonly translucentTokenName?: string;
}

function hasLiteralAlpha(token: GenericDesignTokensCollectionToken): boolean {
  const alpha: unknown = (token.value as { alpha?: unknown } | null)?.alpha;

  return typeof alpha === 'number' && alpha < 1;
}

function resolveColorSwiftValue(
  startName: ArrayDesignTokenName,
  context: ColorWithOpacityResolutionContext,
  depth: number,
): ResolvedSwiftColor {
  if (depth > MAX_REFERENCE_DEPTH) {
    throw new Error(`Reference chain too deep for token ${startName.join('.')}`);
  }

  let current: ArrayDesignTokenName = startName.filter(
    (segment: string): boolean => segment !== '$root',
  );

  for (let step = 0; step < MAX_REFERENCE_DEPTH; step++) {
    const token = getToken(current, context);

    if (isColorTokenWithReferenceMembers(token)) {
      const { components, alpha } = token.value as { components: unknown; alpha?: unknown };

      if (!isCurlyReference(components)) {
        throw new Error(
          `Token ${current.join('.')} has literal color components with a referenced alpha, which is not supported for Swift`,
        );
      }

      const base: ResolvedSwiftColor = resolveColorSwiftValue(
        curlyReferenceToSegmentsReference(components),
        context,
        depth + 1,
      );

      // Swift `.opacity()` multiplies the existing alpha whereas CSS replaces it,
      // so a translucent base would render differently between platforms.
      if (base.translucentTokenName !== undefined) {
        throw new Error(
          `Token ${current.join('.')} references the components of ${base.translucentTokenName}, which already has an alpha. Only opaque colors are supported as components for Swift`,
        );
      }

      return alpha === undefined
        ? base
        : {
            value: `${base.value}.opacity(${resolveAlpha(alpha, context, current)})`,
            translucentTokenName: current.join('.'),
          };
    }

    if (isT1Token(token)) {
      return {
        value: tokenToSwiftValue(context.rawTokensPrefix, token),
        translucentTokenName: hasLiteralAlpha(token) ? current.join('.') : undefined,
      };
    }

    if (!isCurlyReference(token.value)) {
      throw new Error(
        `Token ${current.join('.')} has a literal value and cannot be resolved to a T1 token`,
      );
    }

    current = curlyReferenceToSegmentsReference(token.value);
  }

  throw new Error(`Reference chain too deep for token ${startName.join('.')}`);
}
