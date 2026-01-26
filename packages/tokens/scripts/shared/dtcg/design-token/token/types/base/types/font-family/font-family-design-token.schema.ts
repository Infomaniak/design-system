import { designTokenSchema } from '../../../../design-token.schema.ts';
import { fontFamilyDesignTokenValueSchema } from './value/font-family-design-token-value.schema.ts';

export const fontFamilyDesignTokenSchema = designTokenSchema(
  'fontFamily',
  fontFamilyDesignTokenValueSchema,
);
