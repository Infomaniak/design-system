import type { FontStyle } from '../../font-style.ts';

export function fontStyleToFileName(input: FontStyle): string {
  return `style[${input}]`;
}
