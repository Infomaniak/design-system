import { designTokenSchema } from '../../../../design-token.schema.ts';
import { gradientDesignTokenValueSchema } from './value/gradient-design-token-value.schema.ts';

export const gradientDesignTokenSchema = designTokenSchema(
  'gradient',
  gradientDesignTokenValueSchema,
);
