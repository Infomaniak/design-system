import { predefinedStrokeStyleDesignTokenValueSchema } from './predefined-stroke-style-design-token-value.schema.ts';
import type { PredefinedStrokeStyleDesignTokenValue } from './predefined-stroke-style-design-token-value.ts';

export function isPredefinedStrokeStyleDesignTokenValue(
  input: unknown,
): input is PredefinedStrokeStyleDesignTokenValue {
  return predefinedStrokeStyleDesignTokenValueSchema.safeParse(input).success;
}
