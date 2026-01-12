import { designTokenSchema } from '../../../../design-token.schema.ts';
import { strokeStyleDesignTokenValueSchema } from './value/stroke-style-design-token-value.schema.ts';

export const strokeStyleDesignTokenSchema = designTokenSchema(
  'strokeStyle',
  strokeStyleDesignTokenValueSchema,
);
