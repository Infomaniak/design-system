import { designTokenSchema } from '../../../../design-token.schema.ts';
import { borderDesignTokenValueSchema } from './value/border-design-token-value.schema.ts';

export const borderDesignTokenSchema = designTokenSchema('border', borderDesignTokenValueSchema);
