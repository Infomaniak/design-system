import type { DesignToken } from '../../../token/design-token.ts';

export interface ResolvedDesignToken<GType extends string, GValue> extends DesignToken<
  GType,
  GValue
> {
  readonly $type: GType;
  readonly $value: GValue;
}
