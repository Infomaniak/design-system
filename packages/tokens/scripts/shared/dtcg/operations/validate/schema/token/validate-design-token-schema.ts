import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { genericDesignTokenSchema } from '../../../../design-token/token/generic-design-token.schema.ts';
import type { GenericDesignToken } from '../../../../design-token/token/generic-design-token.ts';
import { colorDesignTokenSchema } from '../../../../design-token/token/types/base/types/color/color-design-token.schema.ts';
import { cubicBezierDesignTokenSchema } from '../../../../design-token/token/types/base/types/cubic-bezier/cubic-bezier-design-token.schema.ts';
import { dimensionDesignTokenSchema } from '../../../../design-token/token/types/base/types/dimension/dimension-design-token.schema.ts';
import { durationDesignTokenSchema } from '../../../../design-token/token/types/base/types/duration/duration-design-token.schema.ts';
import { fontFamilyDesignTokenSchema } from '../../../../design-token/token/types/base/types/font-family/font-family-design-token.schema.ts';
import { fontWeightDesignTokenSchema } from '../../../../design-token/token/types/base/types/font-weight/font-weight-design-token.schema.ts';
import { numberDesignTokenSchema } from '../../../../design-token/token/types/base/types/number/number-design-token.schema.ts';
import { borderDesignTokenSchema } from '../../../../design-token/token/types/composite/types/border/border-design-token.schema.ts';
import { gradientDesignTokenSchema } from '../../../../design-token/token/types/composite/types/gradient/gradient-design-token.schema.ts';
import { shadowDesignTokenSchema } from '../../../../design-token/token/types/composite/types/shadow/shadow-design-token.schema.ts';
import { strokeStyleDesignTokenSchema } from '../../../../design-token/token/types/composite/types/stroke-style/stroke-style-design-token.schema.ts';
import { transitionDesignTokenSchema } from '../../../../design-token/token/types/composite/types/transition/transition-design-token.schema.ts';
import { typographyDesignTokenSchema } from '../../../../design-token/token/types/composite/types/typography/typography-design-token.schema.ts';
import type { ValidateDesignTokensTreeContext } from '../../validate-design-tokens-tree-context.ts';

export function validateDesignTokenSchema(
  input: unknown,
  { file, name, type }: ValidateDesignTokensTreeContext,
): asserts input is GenericDesignToken {
  const token: GenericDesignToken = genericDesignTokenSchema.parse(input);

  type = token.$type ?? type;

  try {
    switch (type) {
      // base
      case 'color':
        colorDesignTokenSchema.parse(token);
        break;
      case 'cubicBezier':
        cubicBezierDesignTokenSchema.parse(token);
        break;
      case 'dimension':
        dimensionDesignTokenSchema.parse(token);
        break;
      case 'duration':
        durationDesignTokenSchema.parse(token);
        break;
      case 'fontFamily':
        fontFamilyDesignTokenSchema.parse(token);
        break;
      case 'fontWeight':
        fontWeightDesignTokenSchema.parse(token);
        break;
      case 'number':
        numberDesignTokenSchema.parse(token);
        break;
      // composite
      case 'border':
        borderDesignTokenSchema.parse(token);
        break;
      case 'gradient':
        gradientDesignTokenSchema.parse(token);
        break;
      case 'shadow':
        shadowDesignTokenSchema.parse(token);
        break;
      case 'strokeStyle':
        strokeStyleDesignTokenSchema.parse(token);
        break;
      case 'transition':
        transitionDesignTokenSchema.parse(token);
        break;
      case 'typography':
        typographyDesignTokenSchema.parse(token);
        break;
      // undefined
      case undefined:
        if (!isCurlyReference(token.$value)) {
          throw new Error(`Missing type.`);
        }
        break;
      default:
        throw new Error(`Unknown token type ${JSON.stringify(type)}.`);
    }
  } catch (error: unknown) {
    throw new Error(
      `From ${JSON.stringify(file)} > ${JSON.stringify(name.join('.'))}: ${Error.isError(error) ? error.message : (error as string)}`,
      { cause: error },
    );
  }
}
