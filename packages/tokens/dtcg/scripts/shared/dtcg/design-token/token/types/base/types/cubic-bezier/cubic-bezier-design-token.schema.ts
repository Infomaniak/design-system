import { designTokenSchema } from '../../../../design-token.schema.ts';
import { cubicBezierDesignTokenValueSchema } from './value/cubic-bezier-design-token-value.schema.ts';

export const cubicBezierDesignTokenSchema = designTokenSchema(
  'cubicBezier',
  cubicBezierDesignTokenValueSchema,
);
