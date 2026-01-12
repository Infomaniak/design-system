import * as z from 'zod';
import { colorDesignTokenSchema } from './types/color/color-design-token.schema.ts';
import { cubicBezierDesignTokenSchema } from './types/cubic-bezier/cubic-bezier-design-token.schema.ts';
import { dimensionDesignTokenSchema } from './types/dimension/dimension-design-token.schema.ts';
import { durationDesignTokenSchema } from './types/duration/duration-design-token.schema.ts';
import { fontFamilyDesignTokenSchema } from './types/font-family/font-family-design-token.schema.ts';
import { fontWeightDesignTokenSchema } from './types/font-weight/font-weight-design-token.schema.ts';
import { numberDesignTokenSchema } from './types/number/number-design-token.schema.ts';

export const baseDesignTokenSchema = z.union([
  colorDesignTokenSchema,
  cubicBezierDesignTokenSchema,
  dimensionDesignTokenSchema,
  durationDesignTokenSchema,
  fontFamilyDesignTokenSchema,
  fontWeightDesignTokenSchema,
  numberDesignTokenSchema,
]);
