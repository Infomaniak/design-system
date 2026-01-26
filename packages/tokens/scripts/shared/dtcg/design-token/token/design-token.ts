import type { ValueOrDesignTokenReference } from '../reference/value-or/value-or-design-token-reference.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#design-token
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#design-token-0
 *
 * > An object with a $value property is a token
 */
export interface DesignToken<GType extends string, GValue> {
  /**
   * @alias $ref
   */
  readonly $value: ValueOrDesignTokenReference<GValue>;
  readonly $type?: GType;
  readonly $deprecated?: boolean | string;
  readonly $description?: string;
  readonly $extensions?: Record<string, any>;
}
