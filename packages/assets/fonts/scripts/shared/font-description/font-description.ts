import type { FontVariant } from './font-variant/font-variant.ts';

export interface FontDescription {
  readonly family: string;
  readonly variants: readonly FontVariant[];
}

export function fontVariantToCss(input: FontVariant): string {
  return input;
}
