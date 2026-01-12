import { designTokenSchema } from '../../../../design-token.schema.ts';
import { shadowDesignTokenValueSchema } from './value/shadow-design-token-value.schema.ts';

export const shadowDesignTokenSchema = designTokenSchema('shadow', shadowDesignTokenValueSchema);
