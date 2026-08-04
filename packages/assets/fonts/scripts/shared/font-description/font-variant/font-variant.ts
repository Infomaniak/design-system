import type { FontStyle } from './font-style/font-style.ts';
import type { FontWeight } from './font-weight/font-weight.ts';

export interface FontVariant {
  readonly src: string;
  readonly style: FontStyle;
  readonly weight: FontWeight;
}
