import type { CurlyReference } from '../../../../../design-token/reference/types/curly/curly-reference.ts';

export interface FigmaDesignToken<GType extends string, GValue> {
  readonly $type: GType;
  readonly $value: GValue | CurlyReference /* figma reference */;
  readonly $description?: string;
  readonly $extensions?: Record<string, any>;
  readonly scopes?: readonly FigmaDesignTokenScope[];
}

export type FigmaDesignTokenScope =
  | 'ALL_SCOPES'
  | 'GAP'
  | 'OPACITY'
  | 'FONT_SIZE'
  | 'FONT_WEIGHT'
  | 'LETTER_SPACING'
  | 'LINE_HEIGHT'
  | 'FONT_FAMILY'
  | 'STROKE_FLOAT'
  | 'WIDTH_HEIGHT'
  | 'EFFECT_FLOAT';
