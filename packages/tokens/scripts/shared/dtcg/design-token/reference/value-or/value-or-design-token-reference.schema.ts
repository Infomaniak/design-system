import * as z from 'zod';
import { designTokenReferenceSchema } from '../design-token-reference.schema.ts';

export function valueOrDesignTokenReferenceSchema<GValue extends z.core.SomeType>(value: GValue) {
  return z.union([value, designTokenReferenceSchema]);
}
