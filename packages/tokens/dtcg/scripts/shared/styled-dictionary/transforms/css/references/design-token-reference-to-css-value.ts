import type { DesignTokenReference } from '../../../../dtcg/design-token/reference/design-token-reference.ts';
import { isCurlyReference } from '../../../../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { CssContext } from '../css-context.ts';

export function designTokenReferenceToCssValue(
  value: DesignTokenReference,
  _ctx: CssContext,
): string {
  if (isCurlyReference(value)) {
    return value as string;
    // return `var(--${ctx.prefix ?? ''}${value.slice(1, -1).replaceAll('.', '-')})`;
  } else {
    throw 'TODO'; // TODO support json ref
  }
}
