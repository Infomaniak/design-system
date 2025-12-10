/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#design-token
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#design-token-0
 *
 * > An object with a $value property is a token
 */
export interface DesignToken<GType extends string, GValue> {
  readonly $value: GValue;
  readonly $type?: GType;
  readonly $deprecated?: boolean | string;
  readonly $description?: string;
  readonly $extensions?: object;
}
