import * as z from 'zod';

export const predefinedStrokeStyleDesignTokenValueSchema = z.enum([
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'outset',
  'inset',
]);
