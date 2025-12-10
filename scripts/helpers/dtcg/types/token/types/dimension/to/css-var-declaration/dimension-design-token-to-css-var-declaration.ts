import { genericDesignTokenToCssVarDeclaration } from '../../../generic/to/css-var-declaration/generic-design-token-to-css-var-declaration.ts';
import type { DimensionDesignToken } from '../../dimension-design-token.ts';
import { dimensionDesignTokenValueToCssValue } from '../../value/to/css-value/dimension-design-token-value-to-css-value.ts';

export function dimensionDesignTokenToCssVarDeclaration(
  token: DimensionDesignToken,
  cssVarName: string,
): string {
  return genericDesignTokenToCssVarDeclaration(
    token,
    cssVarName,
    dimensionDesignTokenValueToCssValue(token.$value),
  );
}
