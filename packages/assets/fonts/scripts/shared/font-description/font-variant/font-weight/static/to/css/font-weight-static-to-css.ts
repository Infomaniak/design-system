import type { FontWeightStatic } from '../../font-weight-static.ts';

export function fontWeightStaticToCss(input: FontWeightStatic): string {
  return input.toString(10);
}
