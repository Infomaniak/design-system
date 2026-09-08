import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  observation,
  variableInfo,
} from '../testing/fixtures.ts';
import { unresolvedBindingRule } from './unresolved-binding.ts';

describe('unresolved-binding rule', () => {
  it('flags a bound variable that cannot be resolved', () => {
    const node = lintNode({ id: 'node:1', name: 'Card' });
    const property = colorProperty('fill', hexPart('#4A90D9', 'VariableID:gone'));
    const context = createLintContext(new Map());

    const findings = unresolvedBindingRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'unresolved-binding',
        ruleTitle: 'Unresolved token',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'Card',
        propertyLabel: 'Fill',
        valueLabel: '#4A90D9',
        message:
          'Bound token could not be resolved — the variable is neither in this file nor accessible from a published library.',
      },
    ]);
  });

  it('flags unresolvable bindings on number properties too', () => {
    const node = lintNode();
    const property = numberProperty('gap', numberPart(12, 'VariableID:gone'));
    const context = createLintContext(new Map());

    expect(
      unresolvedBindingRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('passes resolved variables', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo();
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', token.id));
    const context = createLintContext(new Map([[token.id, token]]));

    expect(
      unresolvedBindingRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes parts without bound variables', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000'));
    const context = createLintContext(new Map());

    expect(
      unresolvedBindingRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });
});
