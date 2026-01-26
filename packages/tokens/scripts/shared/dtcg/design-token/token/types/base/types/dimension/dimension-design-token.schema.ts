import { designTokenSchema } from '../../../../design-token.schema.ts';
import { dimensionDesignTokenValueSchema } from './value/dimension-design-token-value.schema.ts';

export const dimensionDesignTokenSchema = designTokenSchema(
  'dimension',
  dimensionDesignTokenValueSchema,
);
