import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import type { EffectStyleInfo } from '../model/effect-style-info.ts';
import { effectPart, effectProperty, lintNode, observation } from '../testing/fixtures.ts';
import { localEffectStyleRule } from './local-effect-style.ts';

function contextWithStyles(styles: readonly EffectStyleInfo[]) {
  return createLintContext(
    new Map(),
    new Map(
      styles.map((style: EffectStyleInfo): readonly [string, EffectStyleInfo] => [style.id, style]),
    ),
  );
}

describe('local-effect-style rule', () => {
  it('warns for an effect style local to the file', () => {
    const context = contextWithStyles([{ id: 'S:1', name: 'Shadows/soft', remote: false }]);
    const node = lintNode({ name: 'Card' });
    const property = effectProperty(effectPart({ styleId: 'S:1', radius: 4 }));

    expect(localEffectStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([
        {
          ruleId: 'local-effect-style',
          ruleTitle: 'Local effect style',
          severity: 'warning',
          nodeId: 'node:1',
          nodeName: 'Card',
          propertyLabel: 'Effect',
          valueLabel: 'Shadows/soft',
          message:
            'Effect style "Shadows/soft" is local to this file — use a style published from the token library.',
        },
      ]);
  });

  it('passes for a remote (published) effect style', () => {
    const context = contextWithStyles([{ id: 'S:1', name: 'DS shadows', remote: true }]);
    const node = lintNode();
    const property = effectProperty(effectPart({ styleId: 'S:1' }));

    expect(localEffectStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('passes for raw effects without a style', () => {
    const context = contextWithStyles([]);
    const node = lintNode();
    const property = effectProperty(effectPart({ radius: 4 }));

    expect(localEffectStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('passes when the style id cannot be resolved', () => {
    const context = contextWithStyles([]);
    const node = lintNode();
    const property = effectProperty(effectPart({ styleId: 'S:gone' }));

    expect(localEffectStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });
});
