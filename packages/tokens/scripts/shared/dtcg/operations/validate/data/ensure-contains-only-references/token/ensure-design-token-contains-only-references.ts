import { expectDesignTokenReference } from '../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { GenericDesignToken } from '../../../../../design-token/token/generic-design-token.ts';
import { isColorDesignToken } from '../../../../../design-token/token/types/base/types/color/is-color-design-token.ts';
import { isCubicBezierDesignToken } from '../../../../../design-token/token/types/base/types/cubic-bezier/is-cubic-bezier-design-token.ts';
import { isDimensionDesignToken } from '../../../../../design-token/token/types/base/types/dimension/is-dimension-design-token.ts';
import { isDurationDesignToken } from '../../../../../design-token/token/types/base/types/duration/is-duration-design-token.ts';
import { isFontFamilyDesignToken } from '../../../../../design-token/token/types/base/types/font-family/is-font-family-design-token.ts';
import { isFontWeightDesignToken } from '../../../../../design-token/token/types/base/types/font-weight/is-font-weight-design-token.ts';
import { isNumberDesignToken } from '../../../../../design-token/token/types/base/types/number/is-number-design-token.ts';
import { isBorderDesignToken } from '../../../../../design-token/token/types/composite/types/border/is-border-design-token.ts';
import { isGradientDesignToken } from '../../../../../design-token/token/types/composite/types/gradient/is-gradient-design-token.ts';
import { isShadowDesignToken } from '../../../../../design-token/token/types/composite/types/shadow/is-shadow-design-token.ts';
import { isStrokeStyleDesignToken } from '../../../../../design-token/token/types/composite/types/stroke-style/is-stroke-style-design-token.ts';
import { isTransitionDesignToken } from '../../../../../design-token/token/types/composite/types/transition/is-transition-design-token.ts';
import { isTypographyDesignToken } from '../../../../../design-token/token/types/composite/types/typography/is-typography-design-token.ts';
import type { ValidateDesignTokensTreeContext } from '../../../validate-design-tokens-tree-context.ts';
import { ensureColorDesignTokenContainsOnlyReferences } from './types/base/color/ensure-color-design-token-contains-only-references.ts';
import { ensureCubicBezierDesignTokenContainsOnlyReferences } from './types/base/cubic-bezier/ensure-cubic-bezier-design-token-contains-only-references.ts';
import { ensureDimensionDesignTokenContainsOnlyReferences } from './types/base/dimension/ensure-dimension-design-token-contains-only-references.ts';
import { ensureDurationDesignTokenContainsOnlyReferences } from './types/base/duration/ensure-duration-design-token-contains-only-references.ts';
import { ensureFontFamilyDesignTokenContainsOnlyReferences } from './types/base/font-family/ensure-font-family-design-token-contains-only-references.ts';
import { ensureFontWeightDesignTokenContainsOnlyReferences } from './types/base/font-weight/ensure-font-weight-design-token-contains-only-references.ts';
import { ensureNumberDesignTokenContainsOnlyReferences } from './types/base/number/ensure-number-design-token-contains-only-references.ts';
import { ensureBorderDesignTokenContainsOnlyReferences } from './types/composite/border/ensure-border-design-token-contains-only-references.ts';
import { ensureGradientDesignTokenContainsOnlyReferences } from './types/composite/gradient/ensure-gradient-design-token-contains-only-references.ts';
import { ensureShadowDesignTokenContainsOnlyReferences } from './types/composite/shadow/ensure-shadow-design-token-contains-only-references.ts';
import { ensureStrokeStyleDesignTokenContainsOnlyReferences } from './types/composite/stroke-style/ensure-stroke-style-design-token-contains-only-references.ts';
import { ensureTransitionDesignTokenContainsOnlyReferences } from './types/composite/transition/ensure-transition-design-token-contains-only-references.ts';
import { ensureTypographyDesignTokenContainsOnlyReferences } from './types/composite/typography/ensure-typography-design-token-contains-only-references.ts';

export function ensureDesignTokenContainsOnlyReferences(
  token: GenericDesignToken,
  { file, name, type }: ValidateDesignTokensTreeContext,
): void {
  type = token.$type ?? type;

  token = {
    ...token,
    $type: token.$type ?? type,
  };

  try {
    // base
    if (isColorDesignToken(token)) {
      ensureColorDesignTokenContainsOnlyReferences(token);
    } else if (isCubicBezierDesignToken(token)) {
      ensureCubicBezierDesignTokenContainsOnlyReferences(token);
    } else if (isDimensionDesignToken(token)) {
      ensureDimensionDesignTokenContainsOnlyReferences(token);
    } else if (isDurationDesignToken(token)) {
      ensureDurationDesignTokenContainsOnlyReferences(token);
    } else if (isFontFamilyDesignToken(token)) {
      ensureFontFamilyDesignTokenContainsOnlyReferences(token);
    } else if (isFontWeightDesignToken(token)) {
      ensureFontWeightDesignTokenContainsOnlyReferences(token);
    } else if (isNumberDesignToken(token)) {
      ensureNumberDesignTokenContainsOnlyReferences(token);
      // composite
    } else if (isBorderDesignToken(token)) {
      ensureBorderDesignTokenContainsOnlyReferences(token);
    } else if (isGradientDesignToken(token)) {
      ensureGradientDesignTokenContainsOnlyReferences(token);
    } else if (isShadowDesignToken(token)) {
      ensureShadowDesignTokenContainsOnlyReferences(token);
    } else if (isStrokeStyleDesignToken(token)) {
      ensureStrokeStyleDesignTokenContainsOnlyReferences(token);
    } else if (isTransitionDesignToken(token)) {
      ensureTransitionDesignTokenContainsOnlyReferences(token);
    } else if (isTypographyDesignToken(token)) {
      ensureTypographyDesignTokenContainsOnlyReferences(token);
    } else {
      // unknown
      expectDesignTokenReference(token.$value);
    }
  } catch (error: unknown) {
    throw new Error(
      `From ${JSON.stringify(file)} > ${JSON.stringify(name.join('.'))}: ${Error.isError(error) ? error.message : (error as string)}`,
      { cause: error },
    );
  }
}
