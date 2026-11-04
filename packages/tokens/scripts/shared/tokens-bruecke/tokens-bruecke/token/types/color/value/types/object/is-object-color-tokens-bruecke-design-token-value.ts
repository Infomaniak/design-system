import type { ObjectColorTokensBrueckeDesignTokenValue } from './object-color-tokens-bruecke-design-token-value.ts';

export function isObjectColorTokensBrueckeDesignTokenValue(
  value: unknown,
): value is ObjectColorTokensBrueckeDesignTokenValue {
  return typeof value === 'object' && value !== null && 'components' in value && 'alpha' in value;
}
