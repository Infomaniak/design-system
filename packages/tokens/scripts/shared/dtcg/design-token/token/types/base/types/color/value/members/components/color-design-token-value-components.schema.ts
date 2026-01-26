import * as z from 'zod';
import { valueOrJsonReferenceSchema } from '../../../../../../../../reference/types/json/value-or/value-or-json-reference.schema.ts';
import { colorDesignTokenValueComponentSchema } from './component/color-design-token-value-component.schema.ts';

export const colorDesignTokenValueComponentsSchema = z.array(
  valueOrJsonReferenceSchema(colorDesignTokenValueComponentSchema),
);
