import type { FontWeightStatic } from '../../font-weight-static.ts';

export function fontWeightStaticToFileName(input: FontWeightStatic): string {
  return input.toString(10);
}
