import * as z from 'zod';
import { valueOrJsonReferenceSchema } from '../../../../../../reference/types/json/value-or/value-or-json-reference.schema.ts';
import { dimensionDesignTokenValueUnitSchema } from './members/unit/dimension-design-token-value-unit.schema.ts';
import { dimensionDesignTokenValueValueSchema } from './members/value/dimension-design-token-value-value.schema.ts';

export const dimensionDesignTokenValueSchema = z.object({
  value: valueOrJsonReferenceSchema(dimensionDesignTokenValueValueSchema),
  unit: valueOrJsonReferenceSchema(dimensionDesignTokenValueUnitSchema),
});
