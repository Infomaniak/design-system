import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { lintNode, observation, textStylePart, textStyleProperty } from '../testing/fixtures.ts';
import { noTextStyleRule } from './no-text-style.ts';

describe('no-text-style rule', () => {
  const context = createLintContext(new Map());

  it('errors for a TEXT node styled by hand', () => {
    const node = lintNode({ id: 'node:1', name: 'Headline', type: 'TEXT' });
    const property = textStyleProperty(textStylePart({ fontSize: 16, fontWeight: 'Bold' }));

    expect(noTextStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([
        {
          ruleId: 'no-text-style',
          ruleTitle: 'No text style',
          severity: 'error',
          nodeId: 'node:1',
          nodeName: 'Headline',
          propertyLabel: 'Text style',
          valueLabel: 'Bold · 16px',
          message: 'Text styled by hand — apply a published text style.',
        },
      ]);
  });

  it('passes for a node with an applied style', () => {
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(textStylePart({ styleId: 'S:1', fontSize: 16 }));

    expect(noTextStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('falls back to a raw-font label when no props are readable', () => {
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(textStylePart());

    const findings = noTextStyleRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings[0]!.valueLabel).toBe('raw font');
  });

  it('ignores non-textStyle parts defensively', () => {
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(textStylePart());
    const stringPart = { ...property.parts[0]!, value: { kind: 'string' as const, value: 'x' } };

    expect(noTextStyleRule.evaluate(observation(node, property, stringPart), context)).toEqual([]);
  });
});
