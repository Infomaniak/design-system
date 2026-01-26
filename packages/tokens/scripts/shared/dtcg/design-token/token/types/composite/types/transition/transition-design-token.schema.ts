import { designTokenSchema } from '../../../../design-token.schema.ts';
import { transitionDesignTokenValueSchema } from './value/transition-design-token-value.schema.ts';

export const transitionDesignTokenSchema = designTokenSchema(
  'transition',
  transitionDesignTokenValueSchema,
);
