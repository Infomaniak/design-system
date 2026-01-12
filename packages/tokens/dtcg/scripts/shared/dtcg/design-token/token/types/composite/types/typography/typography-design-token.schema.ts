import { designTokenSchema } from '../../../../design-token.schema.ts';
import { typographyDesignTokenValueSchema } from './value/typography-design-token-value.schema.ts';

export const typographyDesignTokenSchema = designTokenSchema(
  'typography',
  typographyDesignTokenValueSchema,
);
