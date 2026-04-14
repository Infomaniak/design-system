import { isObject } from '../../../../../../../../../scripts/helpers/misc/object/is-object.ts';
import { isDesignTokensGroup } from '../../../../design-token/group/is-design-tokens-group.ts';
import type { DesignTokensTree } from '../../../../design-token/tree/design-tokens-tree.ts';
import type { ValidateDesignTokensTreeContext } from '../../validate-design-tokens-tree-context.ts';
import { validateDesignTokensGroupSchema } from '../group/validate-design-tokens-group-schema.ts';
import { validateDesignTokenSchema } from '../token/validate-design-token-schema.ts';

export function validateDesignTokensTreeSchema(
  input: unknown,
  { file, name, type }: ValidateDesignTokensTreeContext,
): asserts input is DesignTokensTree {
  if (!isObject(input)) {
    throw new Error(
      `Expected tree at ${JSON.stringify(name.join('.'))} from ${JSON.stringify(file)}`,
    );
  }

  if (isDesignTokensGroup(input as DesignTokensTree)) {
    validateDesignTokensGroupSchema(input, {
      file,
      name,
      type,
    });
  } else {
    validateDesignTokenSchema(input, {
      file,
      name,
      type,
    });
  }
}
