import type { CurlyReference } from '../../../../../design-token/reference/types/curly/curly-reference.ts';

export interface FigmaDesignToken<GType extends string, GValue> {
  readonly $type: GType;
  readonly $value: GValue | CurlyReference /* figma reference */;
  readonly $description?: string;
  readonly $extensions?: Record<string, any>;
}
