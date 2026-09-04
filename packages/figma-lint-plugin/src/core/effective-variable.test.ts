import { describe, expect, it } from 'vitest';
import { createLintContext } from './context.ts';
import { resolveEffectiveVariable } from './effective-variable.ts';
import type { VariableInfo } from './model/variable-info.ts';
import { variableInfo } from './testing/fixtures.ts';

function contextWith(...variables: readonly VariableInfo[]): ReturnType<typeof createLintContext> {
  return createLintContext(
    new Map(
      variables.map((variable: VariableInfo): readonly [string, VariableInfo] => [
        variable.id,
        variable,
      ]),
    ),
  );
}

describe('resolveEffectiveVariable', () => {
  it('returns variables with a known tier as-is', () => {
    for (const tier of ['t1', 't2', 't3'] as const) {
      const token: ReturnType<typeof variableInfo> = variableInfo({
        id: `V:${tier}`,
        collectionName: tier,
        tier,
      });

      expect(resolveEffectiveVariable(token, contextWith(token))).toBe(token);
    }
  });

  it('follows the alias chain to a known-tier target', () => {
    const semanticToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:t2',
      collectionName: 't2',
      tier: 't2',
    });
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:t2',
    });

    expect(resolveEffectiveVariable(kitToken, contextWith(kitToken, semanticToken))).toBe(
      semanticToken,
    );
  });

  it('follows multi-hop chains through unknown-tier variables', () => {
    const componentToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:t3',
      collectionName: 't3',
      tier: 't3',
    });
    const intermediate: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:mid',
      collectionName: 'other',
      tier: 'unknown',
      aliasTargetId: 'V:t3',
    });
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:mid',
    });

    expect(
      resolveEffectiveVariable(kitToken, contextWith(kitToken, intermediate, componentToken)),
    ).toBe(componentToken);
  });

  it('returns undefined for variables without an alias target (raw value)', () => {
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      collectionName: 'mode',
      tier: 'unknown',
    });

    expect(resolveEffectiveVariable(kitToken, contextWith(kitToken))).toBeUndefined();
  });

  it('returns undefined when the alias target is unresolvable', () => {
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:gone',
    });

    expect(resolveEffectiveVariable(kitToken, contextWith(kitToken))).toBeUndefined();
  });

  it('returns undefined on alias cycles', () => {
    const first: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:a',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:b',
    });
    const second: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:b',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:a',
    });

    expect(resolveEffectiveVariable(first, contextWith(first, second))).toBeUndefined();
  });

  it('returns undefined when a chain exceeds the depth cap', () => {
    const variables: VariableInfo[] = Array.from(
      { length: 7 },
      (_: unknown, index: number): VariableInfo =>
        variableInfo({
          id: `V:${index}`,
          collectionName: 'mode',
          tier: 'unknown',
          aliasTargetId: `V:${index + 1}`,
        }),
    );
    const context = contextWith(...variables);

    expect(resolveEffectiveVariable(variables[0]!, context)).toBeUndefined();
  });
});
