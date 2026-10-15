import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { lintNode, observation, stringPart, stringProperty } from '../testing/fixtures.ts';
import { blendModeRule } from './blend-mode.ts';

describe('blend-mode rule', () => {
  const context = createLintContext(new Map());

  it('warns for a non-default blend mode', () => {
    const node = lintNode({ id: 'node:1', name: 'Card' });
    const property = stringProperty('blendMode', stringPart('MULTIPLY'));

    expect(blendModeRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([
        {
          ruleId: 'blend-mode',
          ruleTitle: 'Blend mode',
          severity: 'warning',
          nodeId: 'node:1',
          nodeName: 'Card',
          propertyLabel: 'Blend mode',
          valueLabel: 'MULTIPLY',
          message: 'Non-default blend mode — the DS expects NORMAL or PASS_THROUGH.',
        },
      ]);
  });

  it('ignores non-string parts defensively', () => {
    const node = lintNode();
    const property = stringProperty('blendMode', stringPart('MULTIPLY'));
    const numberPart = {
      ...property.parts[0]!,
      value: { kind: 'number' as const, value: 2 },
    };

    expect(blendModeRule.evaluate(observation(node, property, numberPart), context)).toEqual([]);
  });
});
