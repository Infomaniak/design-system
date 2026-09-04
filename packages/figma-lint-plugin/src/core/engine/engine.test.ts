import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { LINT_RULES } from '../rules/registry.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  variableInfo,
} from '../testing/fixtures.ts';
import { lintTree } from './lint.ts';
import { countLintableNodes, traverseLintableNodes } from './traverse.ts';

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
      properties: [
        colorProperty('fill', hexPart('#4A90D9')),
        numberProperty('gap', numberPart(12)),
      ],
    });

    const result = await lintTree([tree], {
      rules: LINT_RULES,
      context: createLintContext(new Map()),
    });

    expect(result.inspectedCount).toBe(1);
    expect(result.cancelled).toBe(false);
    expect(result.findings).toHaveLength(2);
    expect(
      result.findings.every(
        (finding: { readonly severity: string }): boolean => finding.severity === 'error',
      ),
    ).toBe(true);
  });

  it('reports progress per node', async () => {
    const trees = [lintNode({ id: 'a' }), lintNode({ id: 'b' }), lintNode({ id: 'c' })];
    const progress: Array<readonly [number, number]> = [];

    await lintTree(trees, {
      rules: LINT_RULES,
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
      lintNode({ id: 'a', properties: [colorProperty('fill', hexPart('#111111'))] }),
      lintNode({ id: 'b' }),
    ];
    let remaining: number = 1;

    const result = await lintTree(trees, {
      rules: LINT_RULES,
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
      rules: LINT_RULES,
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
      rules: LINT_RULES,
      context: createLintContext(new Map()),
      yieldEveryNodes: 1,
    });

    expect(result.inspectedCount).toBe(3);
    expect(result.cancelled).toBe(false);
  });

  it('skips rules that do not apply to the property kind', async () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'spacing/md',
      scopes: ['GAP'],
    });
    const tree = lintNode({
      properties: [numberProperty('gap', numberPart(12, token.id))],
    });

    const result = await lintTree([tree], {
      rules: LINT_RULES,
      context: createLintContext(new Map([[token.id, token]])),
    });

    expect(result.findings).toEqual([]);
  });

  it('keeps bound token usage clean', async () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'color/background/elevation/surface/default',
    });
    const tree = lintNode({
      properties: [colorProperty('fill', hexPart('#FFFFFF', token.id))],
    });

    const result = await lintTree([tree], {
      rules: LINT_RULES,
      context: createLintContext(new Map([[token.id, token]])),
    });

    expect(result.findings).toEqual([]);
  });
});
