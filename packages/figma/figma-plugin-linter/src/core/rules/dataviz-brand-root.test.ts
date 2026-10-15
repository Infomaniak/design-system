import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  observation,
  variableInfo,
} from '../testing/fixtures.ts';
import { datavizBrandRootRule } from './dataviz-brand-root.ts';

describe('dataviz-brand-root rule', () => {
  function contextWithTokens(names: readonly string[]) {
    return createLintContext(
      new Map(
        names.map((name: string): readonly [string, ReturnType<typeof variableInfo>] => [
          `VariableID:${name}`,
          variableInfo({ id: `VariableID:${name}`, name, collectionName: 't2' }),
        ]),
      ),
    );
  }

  it('warns for a bound dataviz token without an @root segment', () => {
    const context = contextWithTokens(['color/background/dataviz/dim1']);
    const node = lintNode();
    const property = colorProperty(
      'fill',
      hexPart('#4A90D9', 'VariableID:color/background/dataviz/dim1'),
    );

    const findings = datavizBrandRootRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('warning');
    expect(findings[0]!.ruleTitle).toBe('Brand/dataviz @root');
    expect(findings[0]!.valueLabel).toBe('color/background/dataviz/dim1 · t2');
    expect(findings[0]!.message).toBe(
      'Brand/dataviz tokens must be the @root variant — only those are published.',
    );
  });

  it('passes for the @root dataviz variant', () => {
    const context = contextWithTokens(['color/background/dataviz/@root/dim1']);
    const node = lintNode();
    const property = colorProperty(
      'fill',
      hexPart('#4A90D9', 'VariableID:color/background/dataviz/@root/dim1'),
    );

    expect(
      datavizBrandRootRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('warns for a brand token without @root and passes the @root variant', () => {
    const context = contextWithTokens([
      'color/background/brand/on-background',
      'color/background/brand/@root/on-background',
    ]);
    const node = lintNode();

    const withoutRoot = colorProperty(
      'fill',
      hexPart('#4A90D9', 'VariableID:color/background/brand/on-background'),
    );
    const withRoot = colorProperty(
      'fill',
      hexPart('#4A90D9', 'VariableID:color/background/brand/@root/on-background'),
    );

    expect(
      datavizBrandRootRule.evaluate(observation(node, withoutRoot, withoutRoot.parts[0]!), context),
    ).toHaveLength(1);
    expect(
      datavizBrandRootRule.evaluate(observation(node, withRoot, withRoot.parts[0]!), context),
    ).toEqual([]);
  });

  it('ignores non-brand non-dataviz tokens', () => {
    const context = contextWithTokens(['color/background/on-background']);
    const node = lintNode();
    const property = colorProperty(
      'fill',
      hexPart('#4A90D9', 'VariableID:color/background/on-background'),
    );

    expect(
      datavizBrandRootRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('ignores unbound parts and non-t2 variables', () => {
    const context = contextWithTokens(['color/background/dataviz/dim1']);
    const node = lintNode();
    const raw = colorProperty('fill', hexPart('#4A90D9'));

    expect(datavizBrandRootRule.evaluate(observation(node, raw, raw.parts[0]!), context)).toEqual(
      [],
    );

    const primitive = colorProperty(
      'fill',
      hexPart('#4A90D9', 'VariableID:color/background/dataviz/dim1'),
    );
    const primitiveContext = createLintContext(
      new Map([
        [
          'VariableID:color/background/dataviz/dim1',
          variableInfo({
            id: 'VariableID:color/background/dataviz/dim1',
            name: 'color/background/dataviz/dim1',
            collectionName: 't1',
            tier: 't1',
          }),
        ],
      ]),
    );

    expect(
      datavizBrandRootRule.evaluate(
        observation(node, primitive, primitive.parts[0]!),
        primitiveContext,
      ),
    ).toEqual([]);
  });
});
