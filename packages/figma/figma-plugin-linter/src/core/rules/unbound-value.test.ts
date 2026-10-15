import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import type { LintPropertyPart } from '../model/lint-property.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  observation,
  variableInfo,
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

  it('flags a raw stroke weight naming the property', () => {
    const node = lintNode({ name: 'Card' });
    const property = numberProperty('padding', numberPart(1));
    const strokeWeight = { ...property, kind: 'strokeWeight' as const };

    const findings = unboundValueRule.evaluate(
      observation(node, strokeWeight, strokeWeight.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.propertyLabel).toBe('Stroke weight');
    expect(findings[0]!.valueLabel).toBe('1px');
    expect(findings[0]!.message).toBe('Raw number value with no design token bound.');
  });

  it('passes a bound stroke weight', () => {
    const node = lintNode();
    const property = {
      ...numberProperty('gap', numberPart(1, 'VariableID:1:9')),
      kind: 'strokeWeight' as const,
    };

    expect(
      unboundValueRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
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
      'strokeWeight',
    ]);
    expect(unboundValueRule.severity).toBe('error');
  });

  describe('fix suggestions', () => {
    const paintPart = (hex: string): LintPropertyPart => ({
      id: 'paint:0',
      value: { kind: 'color', hex },
    });

    it('attaches ordered suggestedFixes when a variable holds the hex', () => {
      const token = variableInfo({
        id: 'V:1',
        name: 'color/background/surface-primary',
        value: { r: 74 / 255, g: 144 / 255, b: 217 / 255, a: 1 },
      });
      const context = createLintContext(new Map([[token.id, token]]));
      const node = lintNode({ id: 'node:1', name: 'Card', type: 'FRAME' });
      const property = colorProperty('fill', paintPart('#4A90D9'));

      const findings = unboundValueRule.evaluate(
        observation(node, property, property.parts[0]!),
        context,
      );

      expect(findings[0]!.suggestedFixes).toEqual([
        {
          label: 'surface-primary',
          kind: 'paint',
          target: 'V:1',
          fields: ['fills'],
          paintIndex: 0,
        },
      ]);
    });

    it('omits suggestedFixes when no variable matches', () => {
      const node = lintNode();
      const property = colorProperty('fill', paintPart('#4A90D9'));

      const findings = unboundValueRule.evaluate(
        observation(node, property, property.parts[0]!),
        context,
      );

      expect(findings[0]!.suggestedFixes).toBeUndefined();
      expect(findings[0]).not.toHaveProperty('suggestedFixes');
    });

    it('suggests float tokens for number parts', () => {
      const token = variableInfo({ id: 'V:space', name: 'spacing/16', value: 16 });
      const context = createLintContext(new Map([[token.id, token]]));
      const node = lintNode();
      const property = numberProperty('padding', {
        id: 'uniform',
        value: { kind: 'number', value: 16 },
      });

      const findings = unboundValueRule.evaluate(
        observation(node, property, property.parts[0]!),
        context,
      );

      expect(findings[0]!.suggestedFixes).toEqual([
        {
          label: '16',
          kind: 'field',
          target: 'V:space',
          fields: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        },
      ]);
    });
  });
});
