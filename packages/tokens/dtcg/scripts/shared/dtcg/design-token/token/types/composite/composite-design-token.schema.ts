import * as z from 'zod';
import { borderDesignTokenSchema } from './types/border/border-design-token.schema.ts';
import { gradientDesignTokenSchema } from './types/gradient/gradient-design-token.schema.ts';
import { shadowDesignTokenSchema } from './types/shadow/shadow-design-token.schema.ts';
import { strokeStyleDesignTokenSchema } from './types/stroke-style/stroke-style-design-token.schema.ts';
import { transitionDesignTokenSchema } from './types/transition/transition-design-token.schema.ts';
import { typographyDesignTokenSchema } from './types/typography/typography-design-token.schema.ts';

export const compositeDesignTokenSchema = z.union([
  borderDesignTokenSchema,
  gradientDesignTokenSchema,
  shadowDesignTokenSchema,
  strokeStyleDesignTokenSchema,
  transitionDesignTokenSchema,
  typographyDesignTokenSchema,
]);
