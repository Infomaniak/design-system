import type { CssContext } from '../../css-context.ts';

export function curlyReferenceToCssValue(value: string, _ctx: CssContext): string {
  return value;
  // return `var(--${ctx.prefix ?? ''}${value.slice(1, -1).replaceAll('.', '-')})`;
}
