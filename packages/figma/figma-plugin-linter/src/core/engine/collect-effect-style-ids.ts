import type { LintNode } from '../model/lint-node.ts';
import { traverseLintableNodes } from './traverse.ts';

/**
 * Collects the distinct effect-style ids referenced by observed effect parts
 * across the lintable tree — the set the sandbox needs to resolve effect-style
 * metadata on demand (e.g. styles applied from a published library).
 *
 * Mirrors the engine's traversal: hidden nodes (and their subtrees) are never
 * linted, so their style references are not collected either.
 */
export function collectEffectStyleIds(roots: readonly LintNode[]): readonly string[] {
  const ids: Set<string> = new Set();

  for (const node of traverseLintableNodes(roots)) {
    for (const property of node.properties) {
      for (const part of property.parts) {
        if (part.value.kind === 'effect' && part.value.styleId !== undefined) {
          ids.add(part.value.styleId);
        }
      }
    }
  }

  return [...ids];
}
