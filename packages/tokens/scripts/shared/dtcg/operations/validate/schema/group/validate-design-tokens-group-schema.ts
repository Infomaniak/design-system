import { designTokensGroupSchema } from '../../../../design-token/group/design-tokens-group.schema.ts';
import type { DesignTokensGroup } from '../../../../design-token/group/design-tokens-group.ts';
import { isDesignTokensGroup } from '../../../../design-token/group/is-design-tokens-group.ts';
import type { ValidateDesignTokensTreeContext } from '../../validate-design-tokens-tree-context.ts';
import { validateDesignTokensTreeSchema } from '../tree/validate-design-tokens-tree-schema.ts';

export function validateDesignTokensGroupSchema(
  input: unknown,
  { file, name, type }: ValidateDesignTokensTreeContext,
): void {
  const token: DesignTokensGroup = designTokensGroupSchema.parse(input) as DesignTokensGroup;

  if (!isDesignTokensGroup(token)) {
    throw new Error(
      `Expected group at ${JSON.stringify(name.join('.'))} from ${JSON.stringify(file)}`,
    );
  }

  const {
    $description,
    $type,
    $extends,
    $ref,
    $deprecated,
    $extensions,
    ...children
  }: DesignTokensGroup = token;

  type = $type ?? type;

  for (const [childName, child] of Object.entries(children)) {
    validateDesignTokensTreeSchema(child, {
      file,
      name: [...name, childName],
      type,
    });
  }
}
