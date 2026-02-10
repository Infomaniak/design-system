export interface TokensBrueckeDesignToken<GType extends string, GValue> {
  readonly $type: GType;
  readonly $value: GValue;
  readonly $description?: string;
  readonly $extensions?: Record<string, unknown>;
  readonly $deprecated?: string | boolean;
  readonly scopes?: readonly TokensBrueckeDesignTokenScope[];
}

export type TokensBrueckeDesignTokenScope =
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
