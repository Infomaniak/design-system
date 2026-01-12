import * as z from 'zod';
import { valueOrJsonReferenceSchema } from '../../../../../../reference/types/json/value-or/value-or-json-reference.schema.ts';
import { colorDesignTokenAlphaSchema } from './members/alpha/color-design-token-alpha.schema.ts';
import { colorDesignTokenColorSpaceSchema } from './members/color-space/color-design-token-color-space.schema.ts';
import { colorDesignTokenValueComponentsSchema } from './members/components/color-design-token-value-components.schema.ts';

export const colorDesignTokenValueSchema = z.object({
  colorSpace: valueOrJsonReferenceSchema(colorDesignTokenColorSpaceSchema),
  components: valueOrJsonReferenceSchema(colorDesignTokenValueComponentsSchema),
  alpha: valueOrJsonReferenceSchema(colorDesignTokenAlphaSchema),
});
