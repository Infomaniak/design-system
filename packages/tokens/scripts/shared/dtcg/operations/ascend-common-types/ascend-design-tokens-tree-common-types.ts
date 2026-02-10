import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isCurlyReference } from '../../design-token/reference/types/curly/is-curly-reference.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function ascendDesignTokensTreeCommonTypes(
  tree: DesignTokensTree,
  inheritedType?: string,
): DesignTokensTree {
  inheritedType = tree.$type ?? inheritedType;

  if (inheritedType !== undefined) {
    // already ascended to the common type, return the original tree
    return tree;
  }

  if (isDesignToken(tree)) {
    if (isCurlyReference(tree.$value)) {
      return tree;
    } else {
      throw new Error('Design token without type is not supported.');
    }
  } else {
    const {
      $description,
      $type,
      $extends,
      $ref,
      $deprecated,
      $extensions,
      ...children
    }: DesignTokensGroup = tree;

    const newChildren: Record<string, DesignTokensTree> = Object.fromEntries(
      Object.entries(children).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          return [name, ascendDesignTokensTreeCommonTypes(child, inheritedType)];
        },
      ),
    );

    const getCommonType = (): string | undefined => {
      let commonType: string | undefined;

      for (const child of Object.values(newChildren)) {
        if (child.$type === undefined) {
          return undefined;
        } else if (commonType === undefined) {
          commonType = child.$type;
        } else if (child.$type !== commonType) {
          return undefined;
        }
      }

      return commonType;
    };

    const hasNewChildren = (): boolean => {
      for (const [name, child] of Object.entries(newChildren)) {
        if (Reflect.get(children, name) !== child) {
          return true;
        }
      }
      return false;
    };

    const commonType: string | undefined = getCommonType();

    if (commonType === undefined) {
      if (hasNewChildren()) {
        return {
          ...removeUndefinedProperties({
            $description,
            $type,
            $extends,
            $ref,
            $deprecated,
            $extensions,
          }),
          ...newChildren,
        };
      } else {
        return tree;
      }
    } else {
      const childrenWithoutTypes: Record<string, DesignTokensTree> = Object.fromEntries(
        Object.entries(newChildren).map(
          ([name, { $type, ...child }]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
            return [name, child];
          },
        ),
      );

      return {
        $type: commonType,
        ...removeUndefinedProperties({
          $description,
          $extends,
          $ref,
          $deprecated,
          $extensions,
        }),
        ...childrenWithoutTypes,
      };
    }
  }
}
