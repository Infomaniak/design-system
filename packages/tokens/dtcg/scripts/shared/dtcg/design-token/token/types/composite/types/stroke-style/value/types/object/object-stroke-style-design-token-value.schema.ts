import * as z from 'zod';
import { strokeStyleDesignTokenValueDashArraySchema } from './members/dash-array/stroke-style-design-token-value-dash-array.schema.ts';
import { strokeStyleDesignTokenValueLineCapSchema } from './members/line-cap/stroke-style-design-token-value-line-cap.schema.ts';

export const objectStrokeStyleDesignTokenValueSchema = z.object({
  dashArray: strokeStyleDesignTokenValueDashArraySchema,
  lineCap: strokeStyleDesignTokenValueLineCapSchema,
});
