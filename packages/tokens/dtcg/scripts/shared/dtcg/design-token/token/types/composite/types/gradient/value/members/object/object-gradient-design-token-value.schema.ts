import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { colorDesignTokenValueSchema } from '../../../../../../base/types/color/value/color-design-token-value.schema.ts';

export const objectGradientDesignTokenValueSchema = z.object({
  color: valueOrDesignTokenReferenceSchema(colorDesignTokenValueSchema),
  position: valueOrDesignTokenReferenceSchema(z.number().min(0).max(1)),
});
