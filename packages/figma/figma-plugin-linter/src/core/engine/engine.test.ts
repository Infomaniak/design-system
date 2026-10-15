import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { LintRule } from '../rules/rule.ts';
import { lintNode, stringPart, stringProperty } from '../testing/fixtures.ts';
import { lintTree } from './lint.ts';
import { countLintableNodes, traverseLintableNodes } from './traverse.ts';

/**
 * Engine tests run against a stub rule so the engine mechanics stay covered
 * independently of the registered rule set (which grows branch by branch).
 */
const TEXT_RULE: LintRule = {
  id: 'text-stub',
  title: 'Text stub',
  severity: 'warning',
  appliesTo: ['textContent'],
  evaluate: (observation): readonly Finding[] => [
    {
      ruleId: TEXT_RULE.id,
      ruleTitle: TEXT_RULE.title,
      severity: TEXT_RULE.severity,
      nodeId: observation.node.id,
      nodeName: observation.node.name,
      propertyLabel: 'Text content',
      valueLabel:
        observation.part.value.kind === 'string' ? observation.part.value.value : 'unknown',
      message: 'Text observed.',
    },
  ],
};

const RULES: readonly LintRule[] = [TEXT_RULE];

describe('traverseLintableNodes', () => {
  it('yields visible nodes depth-first', () => {
    const tree = lintNode({
      id: 'root',
      children: [
        lintNode({ id: 'a' }),
        lintNode({ id: 'b', children: [lintNode({ id: 'b1' }), lintNode({ id: 'b2' })] }),
      ],
    });

    expect(
      [...traverseLintableNodes([tree])].map((node: { readonly id: string }): string => node.id),
    ).toEqual(['root', 'a', 'b', 'b1', 'b2']);
  });

  it('skips hidden nodes and prunes their subtree', () => {
    const tree = lintNode({
      id: 'root',
      children: [
        lintNode({ id: 'hidden', visible: false, children: [lintNode({ id: 'hidden-child' })] }),
        lintNode({ id: 'visible' }),
      ],
    });

    expect(
      [...traverseLintableNodes([tree])].map((node: { readonly id: string }): string => node.id),
    ).toEqual(['root', 'visible']);
  });

  it('lints instance subtrees (overrides are the designer’s responsibility)', () => {
    const tree = lintNode({
      id: 'root',
      children: [
        lintNode({
          id: 'instance',
          type: 'INSTANCE',
          children: [lintNode({ id: 'instance-child' })],
        }),
        lintNode({ id: 'regular' }),
      ],
    });

    expect(
      [...traverseLintableNodes([tree])].map((node: { readonly id: string }): string => node.id),
    ).toEqual(['root', 'instance', 'instance-child', 'regular']);
  });

  it('counts lintable nodes', () => {
    const tree = lintNode({
      children: [
        lintNode({ children: [lintNode()] }),
        lintNode({ visible: false, children: [lintNode()] }),
      ],
    });

    expect(countLintableNodes([tree])).toBe(3);
  });

  it('handles empty forests', () => {
    expect(countLintableNodes([])).toBe(0);
  });
});

describe('lintTree', () => {
  it('evaluates applicable rules on every observed part and reports findings', async () => {
    const tree = lintNode({
      id: 'root',
      name: 'Card',
      properties: [stringProperty('textContent', stringPart('Hello world'))],
    });

    const result = await lintTree([tree], {
      rules: RULES,
      context: createLintContext(new Map()),
    });

    expect(result.inspectedCount).toBe(1);
    expect(result.cancelled).toBe(false);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({ ruleId: 'text-stub', nodeName: 'Card' });
  });

  it('reports progress per node', async () => {
    const trees = [lintNode({ id: 'a' }), lintNode({ id: 'b' }), lintNode({ id: 'c' })];
    const progress: Array<readonly [number, number]> = [];

    await lintTree(trees, {
      rules: RULES,
      context: createLintContext(new Map()),
      onProgress: (completed: number, total: number): void => {
        progress.push([completed, total] as const);
      },
    });

    expect(progress).toEqual([
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });

  it('cancels between nodes and keeps partial findings', async () => {
    const trees = [
      lintNode({ id: 'a', properties: [stringProperty('textContent', stringPart('Hi'))] }),
      lintNode({ id: 'b' }),
    ];
    let remaining: number = 1;

    const result = await lintTree(trees, {
      rules: RULES,
      context: createLintContext(new Map()),
      shouldContinue: (): boolean => {
        remaining -= 1;
        return remaining >= 0;
      },
    });

    expect(result.cancelled).toBe(true);
    expect(result.inspectedCount).toBe(1);
    expect(result.findings).toHaveLength(1);
  });

  it('yields cooperatively every N nodes', async () => {
    const trees = Array.from(
      { length: 5 },
      (_: unknown, index: number): ReturnType<typeof lintNode> => lintNode({ id: `node:${index}` }),
    );
    let yields: number = 0;

    await lintTree(trees, {
      rules: RULES,
      context: createLintContext(new Map()),
      yieldEveryNodes: 2,
      yieldNow: (): Promise<void> => {
        yields += 1;
        return Promise.resolve();
      },
    });

    expect(yields).toBe(2);
  });

  it('falls back to the default cooperative yield when none is provided', async () => {
    const trees = Array.from(
      { length: 3 },
      (_: unknown, index: number): ReturnType<typeof lintNode> => lintNode({ id: `node:${index}` }),
    );

    const result = await lintTree(trees, {
      rules: RULES,
      context: createLintContext(new Map()),
      yieldEveryNodes: 1,
    });

    expect(result.inspectedCount).toBe(3);
    expect(result.cancelled).toBe(false);
  });
});
