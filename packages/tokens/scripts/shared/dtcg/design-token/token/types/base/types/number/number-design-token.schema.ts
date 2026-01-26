import { designTokenSchema } from '../../../../design-token.schema.ts';
import { numberDesignTokenValueSchema } from './value/number-design-token-value.schema.ts';

export const numberDesignTokenSchema = designTokenSchema('number', numberDesignTokenValueSchema);
