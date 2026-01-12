import type { DesignTokenReference } from '../../../../dtcg/design-token/reference/design-token-reference.ts';
import { curlyReferenceSchema } from '../../../../dtcg/design-token/reference/types/curly/curly-reference.schema.ts';
import type { CssContext } from '../css-context.ts';

export function designTokenReferenceToCssValue(
  value: DesignTokenReference,
  _ctx: CssContext,
): string {
  if (curlyReferenceSchema.safeParse(value).success) {
    return value as string;
    // return `var(--${ctx.prefix ?? ''}${value.slice(1, -1).replaceAll('.', '-')})`;
  } else {
    throw 'TODO'; // TODO support json ref
  }
}
