import * as z from 'zod';
import { valueOrJsonReferenceSchema } from '../../../../../../reference/types/json/value-or/value-or-json-reference.schema.ts';
import { durationDesignTokenValueUnitSchema } from './members/unit/duration-design-token-value-unit.schema.ts';
import { durationDesignTokenValueValueSchema } from './members/value/duration-design-token-value-value.schema.ts';

export const durationDesignTokenValueSchema = z.object({
  value: valueOrJsonReferenceSchema(durationDesignTokenValueValueSchema),
  unit: valueOrJsonReferenceSchema(durationDesignTokenValueUnitSchema),
});
