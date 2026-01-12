import * as z from 'zod';
import { valueOrJsonReferenceSchema } from '../../../../../../../../reference/types/json/value-or/value-or-json-reference.schema.ts';

export const stringArrayFontFamilyDesignTokenValueSchema = z.array(
  valueOrJsonReferenceSchema(z.string()),
);
