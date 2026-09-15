import type { LintNode } from '../model/lint-node.ts';

/**
 * A node is lintable when it is visible:
 * - hidden nodes (and their subtrees) are skipped
 * - instances ARE linted: overrides applied on an instance are the designer's
 *   responsibility, and inherited bindings carry token usage worth reporting
 */
export function isLintableNode(node: LintNode): boolean {
  return node.visible;
}

/**
 * Depth-first traversal of every lintable node in the tree, pruning hidden
 * subtrees.
 */
export function* traverseLintableNodes(
  roots: readonly LintNode[],
): Generator<LintNode, void, void> {
  for (const root of roots) {
    if (!isLintableNode(root)) {
      continue;
    }

    yield root;
    yield* traverseLintableNodes(root.children);
  }
}

export function countLintableNodes(roots: readonly LintNode[]): number {
  return Array.from(traverseLintableNodes(roots)).length;
}
