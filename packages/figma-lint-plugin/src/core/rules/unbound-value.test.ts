import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  observation,
} from '../testing/fixtures.ts';
import { unboundValueRule } from './unbound-value.ts';

describe('unbound-value rule', () => {
  const context = createLintContext(new Map());

  it('flags a raw fill with no bound variable', () => {
    const node = lintNode({ id: 'node:1', name: 'Icon/close' });
    const property = colorProperty('fill', hexPart('#4A90D9'));

    expect(
      unboundValueRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([
      {
        ruleId: 'unbound-value',
        ruleTitle: 'Unbound value',
        severity: 'error',
        nodeId: 'node:1',
        nodeName: 'Icon/close',
        propertyLabel: 'Fill',
        valueLabel: '#4A90D9',
        message: 'Raw color value with no design token bound.',
      },
    ]);
  });

  it('flags raw number properties', () => {
    const node = lintNode();
    const property = numberProperty('padding', numberPart(16));

    const findings = unboundValueRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.valueLabel).toBe('16px');
    expect(findings[0]!.message).toBe('Raw number value with no design token bound.');
  });

  it('passes parts with a bound variable', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#4A90D9', 'VariableID:1:2'));

    expect(
      unboundValueRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('applies to every checked property kind', () => {
    expect(unboundValueRule.appliesTo).toEqual([
      'fill',
      'stroke',
      'padding',
      'gap',
      'cornerRadius',
    ]);
    expect(unboundValueRule.severity).toBe('error');
  });
});
