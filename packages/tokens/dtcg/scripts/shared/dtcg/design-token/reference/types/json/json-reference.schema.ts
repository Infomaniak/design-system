import * as z from 'zod';
import { jsonPointerSchema } from './members/pointer/json-pointer.schema.ts';

export const jsonReferenceSchema = z.looseObject({
  $ref: jsonPointerSchema,
});
