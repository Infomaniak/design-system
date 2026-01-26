import * as z from 'zod';
import { curlyReferenceSchema } from './types/curly/curly-reference.schema.ts';
import { jsonReferenceSchema } from './types/json/json-reference.schema.ts';

export const designTokenReferenceSchema = z.union([jsonReferenceSchema, curlyReferenceSchema]);
