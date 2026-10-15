import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { colorProperty, hexPart, lintNode, numberPart, observation } from '../testing/fixtures.ts';
import { opacityOverColorRule } from './opacity-over-color.ts';

function opacityProperty(value: number) {
  const property = {
    kind: 'opacity' as const,
    valueKind: 'number' as const,
    parts: [numberPart(value)],
  };

  return property;
}

describe('opacity-over-color rule', () => {
  const context = createLintContext(new Map());

  it('warns for semi-transparent opacity over a colored fill', () => {
    const node = lintNode({
      name: 'Overlay',
      properties: [colorProperty('fill', hexPart('#4A90D9'))],
    });
    const property = opacityProperty(0.5);

    const findings = opacityOverColorRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'opacity-over-color',
        ruleTitle: 'Opacity over color',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'Overlay',
        propertyLabel: 'Opacity',
        valueLabel: '50%',
        message:
          'Semi-transparent layer over a colored fill — the DS expresses transparency with tokens, not node opacity.',
      },
    ]);
  });

  it('is clean for full opacity, even over a colored fill', () => {
    const node = lintNode({ properties: [colorProperty('fill', hexPart('#4A90D9'))] });
    const property = opacityProperty(1);

    expect(
      opacityOverColorRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('is clean for semi-transparent nodes without a colored fill', () => {
    const node = lintNode();
    const property = opacityProperty(0.5);

    expect(
      opacityOverColorRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('rounds the value label to whole percents', () => {
    const node = lintNode({ properties: [colorProperty('fill', hexPart('#4A90D9'))] });
    const property = opacityProperty(0.125);

    const findings = opacityOverColorRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings[0]!.valueLabel).toBe('13%');
  });

  it('ignores non-number parts defensively', () => {
    const node = lintNode({ properties: [colorProperty('fill', hexPart('#4A90D9'))] });
    const property = opacityProperty(0.5);
    const stringPart = { ...property.parts[0]!, value: { kind: 'string' as const, value: 'x' } };

    expect(opacityOverColorRule.evaluate(observation(node, property, stringPart), context)).toEqual(
      [],
    );
  });
});
