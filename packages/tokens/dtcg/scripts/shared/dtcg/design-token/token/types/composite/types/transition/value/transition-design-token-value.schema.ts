import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { cubicBezierDesignTokenValueSchema } from '../../../../base/types/cubic-bezier/value/cubic-bezier-design-token-value.schema.ts';
import { durationDesignTokenValueSchema } from '../../../../base/types/duration/value/duration-design-token-value.schema.ts';

export const transitionDesignTokenValueSchema = z.object({
  duration: valueOrDesignTokenReferenceSchema(durationDesignTokenValueSchema),
  delay: valueOrDesignTokenReferenceSchema(durationDesignTokenValueSchema),
  timingFunction: valueOrDesignTokenReferenceSchema(cubicBezierDesignTokenValueSchema),
});
