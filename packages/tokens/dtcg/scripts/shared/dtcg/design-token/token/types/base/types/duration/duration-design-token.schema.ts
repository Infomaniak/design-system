import { designTokenSchema } from '../../../../design-token.schema.ts';
import { durationDesignTokenValueSchema } from './value/duration-design-token-value.schema.ts';

export const durationDesignTokenSchema = designTokenSchema(
  'duration',
  durationDesignTokenValueSchema,
);
