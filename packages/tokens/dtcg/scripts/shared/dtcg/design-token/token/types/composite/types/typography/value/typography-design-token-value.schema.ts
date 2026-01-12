import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { dimensionDesignTokenValueSchema } from '../../../../base/types/dimension/value/dimension-design-token-value.schema.ts';
import { fontFamilyDesignTokenValueSchema } from '../../../../base/types/font-family/value/font-family-design-token-value.schema.ts';
import { fontWeightDesignTokenValueSchema } from '../../../../base/types/font-weight/value/font-weight-design-token-value.schema.ts';
import { numberDesignTokenValueSchema } from '../../../../base/types/number/value/number-design-token-value.schema.ts';

export const typographyDesignTokenValueSchema = z.object({
  fontFamily: valueOrDesignTokenReferenceSchema(fontFamilyDesignTokenValueSchema),
  fontSize: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  fontWeight: valueOrDesignTokenReferenceSchema(fontWeightDesignTokenValueSchema),
  letterSpacing: valueOrDesignTokenReferenceSchema(dimensionDesignTokenValueSchema),
  lineHeight: valueOrDesignTokenReferenceSchema(numberDesignTokenValueSchema),
});
