import type { DesignTokensTree } from '../../../../tree/design-tokens-tree.ts';
import type { SegmentsDesignTokenReference } from '../segments-design-token-reference.ts';

export function resolveSegmentsDesignTokenReference(
  reference: SegmentsDesignTokenReference,
  tree: DesignTokensTree,
): unknown {
  let node: unknown = tree;

  for (let i: number = 0; i < reference.length; i++) {
    const segment: string = reference[i];

    if (typeof node !== 'object' || node === null) {
      throw new Error(`Reference to "${reference.slice(0, i).join('.')}" is not an object.`);
    }

    if (!Reflect.has(node, segment)) {
      throw new Error(`Reference to "${reference.slice(0, i + 1).join('.')}" not found.`);
    }

    node = Reflect.get(node, segment) as unknown;
  }

  return node;
}
