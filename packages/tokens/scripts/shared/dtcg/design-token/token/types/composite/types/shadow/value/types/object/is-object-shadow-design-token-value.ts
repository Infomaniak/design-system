import { objectShadowDesignTokenValueSchema } from './object-shadow-design-token-value.schema.ts';
import type { ObjectShadowDesignTokenValue } from './object-shadow-design-token-value.ts';

export function isObjectShadowDesignTokenValue(
  input: unknown,
): input is ObjectShadowDesignTokenValue {
  return objectShadowDesignTokenValueSchema.safeParse(input).success;
}
