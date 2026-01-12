import * as z from 'zod';
import { designTokensGroupSchema } from '../group/design-tokens-group.schema.ts';
import { genericDesignTokenSchema } from '../token/generic-design-token.schema.ts';

export const designTokenGroupSchema = z.union([genericDesignTokenSchema, designTokensGroupSchema]);
