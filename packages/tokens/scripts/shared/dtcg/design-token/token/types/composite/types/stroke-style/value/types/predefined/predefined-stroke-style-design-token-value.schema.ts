import * as z from 'zod';

export const predefinedStrokeStyleDesignTokenValueSchema = z.literal([
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'outset',
  'inset',
]);
