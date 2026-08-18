import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import type { GenericDesignToken } from '../../design-token/token/generic-design-token.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export interface MergeDesignTokensTreeDescriptionsContext {
  readonly $description?: string;
}

export function mergeDesignTokensTreeDescriptions(
  mainTree: DesignTokensTree,
  descriptionTree: DesignTokensTree,
  { $description: parentDescription }: MergeDesignTokensTreeDescriptionsContext = {},
): DesignTokensTree {
  if (isDesignToken(mainTree)) {
    if (isDesignToken(descriptionTree)) {
      const {
        $value,
        $type,
        $deprecated,
        $description = descriptionTree.$description,
        $extensions,
      }: GenericDesignToken = mainTree;

      console.log('$description === parentDescription', $description === parentDescription);
      return removeUndefinedProperties({
        $value,
        $type,
        $deprecated,
        $description: $description === parentDescription ? undefined : $description,
        $extensions,
      });
    } else {
      // diverging -> keep main tree
      return mainTree;
    }
  } else {
    if (isDesignToken(descriptionTree)) {
      // diverging -> keep main tree
      return mainTree;
    } else {
      const {
        $description = descriptionTree.$description,
        $type,
        $extends,
        $ref,
        $deprecated,
        $extensions,
        ...children
      }: DesignTokensGroup = mainTree;

      return removeUndefinedProperties({
        $description: $description === parentDescription ? undefined : $description,
        $type,
        $extends,
        $ref,
        $deprecated,
        $extensions,
        ...Object.fromEntries(
          Object.entries(children).map(
            ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
              return [
                name,
                Reflect.has(descriptionTree, name)
                  ? mergeDesignTokensTreeDescriptions(child, Reflect.get(descriptionTree, name), {
                      $description: $description ?? parentDescription,
                    })
                  : child,
              ];
            },
          ),
        ),
      });
    }
  }
}
