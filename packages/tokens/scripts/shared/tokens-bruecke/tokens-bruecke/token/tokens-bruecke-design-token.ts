export interface TokensBrueckeDesignToken<GType extends string, GValue> {
  readonly $type: GType;
  readonly $value: GValue;
  readonly $description?: string;
  readonly $extensions?: Record<string, unknown>;
  readonly $deprecated?: string | boolean;
}
