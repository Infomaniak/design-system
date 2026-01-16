import { colorDesignTokenValueSchema } from './color-design-token-value.schema.ts';
import type { ColorDesignTokenValue } from './color-design-token-value.ts';

export function isColorDesignTokenValue(input: unknown): input is ColorDesignTokenValue {
  return colorDesignTokenValueSchema.safeParse(input).success;
}
