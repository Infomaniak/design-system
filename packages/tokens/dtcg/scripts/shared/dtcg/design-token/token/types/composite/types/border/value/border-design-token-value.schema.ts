import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { colorDesignTokenValueSchema } from '../../../../base/types/color/value/color-design-token-value.schema.ts';
import { dimensionDesignTokenValueSchema } from '../../../../base/types/dimension/value/dimension-design-token-value.schema.ts';
import { strokeStyleDesignTokenValueSchema } from '../../stroke-style/value/stroke-style-design-token-value.schema.ts';

export const borderDesignTokenValueSchema = z.object({
  color: valueOrDesignTokenReferenceSchema(colorDesignTokenValueSchema),
  width: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  style: valueOrDesignTokenReferenceSchema(strokeStyleDesignTokenValueSchema),
});
