import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { LintNode } from '../model/lint-node.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { LintRule } from '../rules/rule.ts';
import { countLintableNodes, traverseLintableNodes } from './traverse.ts';

export interface LintTreeOptions {
  readonly rules: readonly LintRule[];
  readonly context: LintContext;
  readonly onProgress?: (completed: number, total: number) => void;
  readonly shouldContinue?: () => boolean;
  /** Cooperative yield awaited every `yieldEveryNodes` nodes (default 50). */
  readonly yieldNow?: () => Promise<void>;
  readonly yieldEveryNodes?: number;
}

export interface LintTreeResult {
  readonly findings: readonly Finding[];
  readonly inspectedCount: number;
  readonly cancelled: boolean;
}

const DEFAULT_YIELD_EVERY_NODES: number = 50;

function defaultYieldNow(): Promise<void> {
  return Promise.resolve();
}

/**
 * Lints a forest of `LintNode`s: traverses lintable nodes, evaluates every
 * applicable rule on every observed property part, reports progress and honours
 * cooperative cancellation.
 *
 * A cancelled run keeps the findings gathered so far (`cancelled: true`).
 */
export async function lintTree(
  roots: readonly LintNode[],
  options: LintTreeOptions,
): Promise<LintTreeResult> {
  const {
    rules,
    context,
    onProgress,
    shouldContinue,
    yieldNow = defaultYieldNow,
    yieldEveryNodes = DEFAULT_YIELD_EVERY_NODES,
  } = options;

  const total: number = countLintableNodes(roots);
  const findings: Finding[] = [];
  let cancelled: boolean = false;
  let completed: number = 0;
  let nodesSinceYield: number = 0;

  for (const node of traverseLintableNodes(roots)) {
    if (shouldContinue !== undefined && !shouldContinue()) {
      cancelled = true;
      break;
    }

    for (const property of node.properties) {
      for (const part of property.parts) {
        const observation: PropertyObservation = { node, property, part };

        for (const rule of rules) {
          if (!rule.appliesTo.includes(property.kind)) {
            continue;
          }

          findings.push(...rule.evaluate(observation, context));
        }
      }
    }

    completed += 1;
    onProgress?.(completed, total);
    nodesSinceYield += 1;

    if (nodesSinceYield >= yieldEveryNodes) {
      nodesSinceYield = 0;
      await yieldNow();
    }
  }

  return { findings, inspectedCount: completed, cancelled };
}
