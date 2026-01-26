import { designTokenReferenceSchema } from './design-token-reference.schema.ts';
import type { DesignTokenReference } from './design-token-reference.ts';

export function isDesignTokenReference(input: unknown): input is DesignTokenReference {
  return designTokenReferenceSchema.safeParse(input).success;
}
