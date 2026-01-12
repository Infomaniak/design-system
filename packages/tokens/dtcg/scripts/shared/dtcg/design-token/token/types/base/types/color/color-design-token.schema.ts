import { designTokenSchema } from '../../../../design-token.schema.ts';
import { colorDesignTokenValueSchema } from './value/color-design-token-value.schema.ts';

export const colorDesignTokenSchema = designTokenSchema('color', colorDesignTokenValueSchema);
