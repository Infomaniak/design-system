import * as z from 'zod';

export const fontFaceFontWeightAbsoluteSchema = z.union([
  z.enum(['normal', 'bold']),
  z.number().int().min(1).max(1000),
]);

export const fontFaceFontWeightAbsoluteRangeSchema = z.tuple([
  fontFaceFontWeightAbsoluteSchema,
  fontFaceFontWeightAbsoluteSchema,
]);

export const fontFaceFontWeightSchema = z.union([
  z.literal('auto'),
  fontFaceFontWeightAbsoluteSchema,
  fontFaceFontWeightAbsoluteRangeSchema,
]);
