import type { FontVariant } from './font-variant/font-variant.ts';

export interface FontDescription {
  readonly family: string;
  readonly license?: string;
  readonly variants: readonly FontVariant[];
}
