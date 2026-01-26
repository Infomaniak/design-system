import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import { isDesignTokensGroup } from '../../../design-token/group/is-design-tokens-group.ts';
import { isCurlyReference } from '../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { isJsonPointer } from '../../../design-token/reference/types/json/members/pointer/is-json-pointer.ts';
import { jsonPointerToSegmentsReference } from '../../../design-token/reference/types/json/members/pointer/to/segments-reference/json-pointer-to-segments-reference.ts';
import type { SegmentsReference } from '../../../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { GenericDesignToken } from '../../../design-token/token/generic-design-token.ts';
import { isDesignToken } from '../../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../../design-token/tree/design-tokens-tree.ts';
import { extendDesignTokensGroup } from '../extend-design-tokens-group.ts';

export const DESIGN_TOKENS_TREE_EXTENDS_RESOLVING = Symbol('DESIGN_TOKENS_TREE_EXTENDS_RESOLVING');

export interface ResolveDesignTokensTreeExtendsContext {
  readonly root: DesignTokensTree;
  readonly cache: Map<
    DesignTokensTree,
    DesignTokensTree | typeof DESIGN_TOKENS_TREE_EXTENDS_RESOLVING
  >;
}

/**
 * Resolves the "$extends" properties of a design tokens tree.
 *
 * This function ensures that extended tokens are correctly resolved within the
 * tree and utilizes a context object to manage state and caching during resolution.
 *
 * @param {DesignTokensTree} input - The design tokens tree to process. It could represent
 *                                    either a design token or a group of tokens.
 * @param {ResolveDesignTokensTreeExtendsContext} [ctx] - An optional context object used to
 *                                                        manage state and caching during the
 *                                                        resolution process. Defaults to an
 *                                                        object containing the root of the tree
 *                                                        and a new Map instance for caching.
 * @returns {DesignTokensTree} The resolved design tokens tree with extensions applied.
 */
export function resolveDesignTokensTreeExtends(
  input: DesignTokensTree,
  ctx: ResolveDesignTokensTreeExtendsContext = {
    root: input,
    cache: new Map(),
  },
): DesignTokensTree {
  if (isDesignToken(input)) {
    return input;
  } else {
    const cached: DesignTokensTree | typeof DESIGN_TOKENS_TREE_EXTENDS_RESOLVING | undefined =
      ctx.cache.get(input);

    if (cached === DESIGN_TOKENS_TREE_EXTENDS_RESOLVING) {
      throw new Error('Circular reference detected.');
    } else if (cached !== undefined) {
      return cached;
    }

    const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = input;

    let reference: SegmentsReference | undefined;

    if ($extends !== undefined && $ref !== undefined) {
      throw new Error('Cannot have simultaneously $extends and $ref.');
    }

    if ($extends !== undefined) {
      if (!isCurlyReference($extends)) {
        throw new Error('$extends is not a curly reference.');
      }

      reference = curlyReferenceToSegmentsReference($extends);
    } else if ($ref !== undefined) {
      if (!isJsonPointer($ref)) {
        throw new Error('$ref is not a json reference.');
      }

      reference = jsonPointerToSegmentsReference($ref);
    }

    let output: DesignTokensTree = {
      ...removeUndefinedProperties({
        $description,
        $type,
        $deprecated,
        $extensions,
      }),
      ...Object.fromEntries(
        Object.entries(children).map(
          ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
            return [name, resolveDesignTokensTreeExtends(child, ctx)];
          },
        ),
      ),
    };

    ctx.cache.set(input, DESIGN_TOKENS_TREE_EXTENDS_RESOLVING);

    if (reference !== undefined) {
      let node: any = ctx.root;
      let inherited: Pick<
        GenericDesignToken,
        '$description' | '$type' | '$deprecated' | '$extensions'
      > = removeUndefinedProperties({
        $description: node.$description,
        $type: node.$type,
        $deprecated: node.$deprecated,
        $extensions: node.$extensions,
      });

      for (let i: number = 0; i < reference.length; i++) {
        const segment: string = reference[i];
        const isLast: boolean = i === reference.length - 1;

        if (!Reflect.has(node, reference[i])) {
          throw new Error(`Unresolvable reference: ${reference.slice(0, i).join('.')}`);
        }

        node = Reflect.get(node, segment);

        if (!isDesignTokensGroup(node)) {
          if (isLast) {
            return {
              $value: segmentsReferenceToCurlyReference(reference),
            };
          }
          throw new Error('Not a DesignTokensGroup.');
        }

        if (Reflect.has(node, '$extends') || Reflect.has(node, '$ref') || isLast) {
          node = resolveDesignTokensTreeExtends(node, ctx);
        }

        inherited = {
          ...inherited,
          ...removeUndefinedProperties({
            $description: node.$description,
            $type: node.$type,
            $deprecated: node.$deprecated,
            $extensions: node.$extensions,
          }),
        };

        node = {
          ...inherited,
          ...node,
        };
      }

      output = extendDesignTokensGroup(output, node);
    }

    ctx.cache.set(input, output);

    return output;
  }
}
