import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { dimensionDesignTokenValueSchema } from '../../../../../../../../base/types/dimension/value/dimension-design-token-value.schema.ts';

export const strokeStyleDesignTokenValueDashArraySchema = z.array(
  valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
);
