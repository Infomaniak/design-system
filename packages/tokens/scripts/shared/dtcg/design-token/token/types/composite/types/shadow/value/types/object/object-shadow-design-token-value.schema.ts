import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { colorDesignTokenValueSchema } from '../../../../../../base/types/color/value/color-design-token-value.schema.ts';
import { dimensionDesignTokenValueSchema } from '../../../../../../base/types/dimension/value/dimension-design-token-value.schema.ts';

export const objectShadowDesignTokenValueSchema = z.object({
  color: valueOrDesignTokenReferenceSchema(colorDesignTokenValueSchema),
  offsetX: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  offsetY: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  blur: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  spread: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  inset: z.boolean().optional().default(false),
});
