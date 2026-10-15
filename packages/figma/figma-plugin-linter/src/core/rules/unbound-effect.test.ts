import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { effectPart, effectProperty, lintNode, observation } from '../testing/fixtures.ts';
import { unboundEffectRule } from './unbound-effect.ts';

describe('unbound-effect rule', () => {
  const context = createLintContext(new Map());

  it('errors for a drop shadow with raw settings', () => {
    const node = lintNode({ id: 'node:1', name: 'Card' });
    const property = effectProperty(
      effectPart({ effectType: 'DROP_SHADOW', radius: 4, offset: { x: 0, y: 2 } }),
    );

    expect(unboundEffectRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([
        {
          ruleId: 'unbound-effect',
          ruleTitle: 'Unbound effect',
          severity: 'error',
          nodeId: 'node:1',
          nodeName: 'Card',
          propertyLabel: 'Effect',
          valueLabel: 'DROP_SHADOW 4px 0/2',
          message: 'Effect with raw settings and no effect style or variable bound.',
        },
      ]);
  });

  it('passes an effect whose color is variable-bound', () => {
    const node = lintNode();
    const property = effectProperty(effectPart({ boundVariableId: 'VariableID:1:2' }));

    expect(unboundEffectRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('passes an effect applied through a style (checked by local-effect-style)', () => {
    const node = lintNode();
    const property = effectProperty(effectPart({ styleId: 'S:1' }));

    expect(unboundEffectRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('ignores non-effect parts defensively', () => {
    const node = lintNode();
    const property = effectProperty(effectPart());
    const stringPart = { ...property.parts[0]!, value: { kind: 'string' as const, value: 'x' } };

    expect(unboundEffectRule.evaluate(observation(node, property, stringPart), context)).toEqual(
      [],
    );
  });
});
