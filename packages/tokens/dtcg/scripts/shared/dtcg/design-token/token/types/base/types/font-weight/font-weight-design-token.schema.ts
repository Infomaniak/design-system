import { designTokenSchema } from '../../../../design-token.schema.ts';
import { fontWeightDesignTokenValueSchema } from './value/font-weight-design-token-value.schema.ts';

export const fontWeightDesignTokenSchema = designTokenSchema(
  'fontWeight',
  fontWeightDesignTokenValueSchema,
);
