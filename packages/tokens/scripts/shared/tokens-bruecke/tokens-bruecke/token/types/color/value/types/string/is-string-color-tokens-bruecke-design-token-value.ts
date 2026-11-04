import type { StringColorTokensBrueckeDesignTokenValue } from './string-color-tokens-bruecke-design-token-value.ts';

export function isStringColorTokensBrueckeDesignTokenValue(
  value: unknown,
): value is StringColorTokensBrueckeDesignTokenValue {
  return typeof value === 'string';
}
