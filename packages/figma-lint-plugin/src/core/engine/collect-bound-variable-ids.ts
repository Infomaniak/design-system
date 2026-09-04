import type { LintNode } from '../model/lint-node.ts';
import { traverseLintableNodes } from './traverse.ts';

/**
 * Collects the distinct variable ids bound to any observed property part across
 * the lintable tree — the set the sandbox needs to resolve token metadata
 * on demand (e.g. tokens bound from a published library).
 *
 * Mirrors the engine's traversal: hidden nodes (and their subtrees) are never
 * linted, so their bindings are not collected either.
 */
export function collectBoundVariableIds(roots: readonly LintNode[]): readonly string[] {
  const ids: Set<string> = new Set();

  for (const node of traverseLintableNodes(roots)) {
    for (const property of node.properties) {
      for (const part of property.parts) {
        if (part.boundVariableId !== undefined) {
          ids.add(part.boundVariableId);
        }
      }
    }
  }

  return [...ids];
}
