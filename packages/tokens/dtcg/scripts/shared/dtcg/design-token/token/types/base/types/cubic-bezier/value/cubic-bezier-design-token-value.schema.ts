import * as z from 'zod';
import { valueOrJsonReferenceSchema } from '../../../../../../reference/types/json/value-or/value-or-json-reference.schema.ts';
import { cubicBezierDesignTokenValueCoordinateSchema } from './members/coordinate/cubic-bezier-design-token-value-coordinate.schema.ts';

export const cubicBezierDesignTokenValueSchema = z.array(
  valueOrJsonReferenceSchema(cubicBezierDesignTokenValueCoordinateSchema),
);
