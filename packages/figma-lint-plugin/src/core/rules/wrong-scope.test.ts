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
import { wrongScopeRule } from './wrong-scope.ts';

describe('wrong-scope rule', () => {
  it('flags a variable whose scopes miss the required scope', () => {
    const strokeToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'color/background/disabled',
      scopes: ['FRAME_FILL'],
    });
    const node = lintNode({ type: 'TEXT' });
    const property = colorProperty('fill', hexPart('#000000', strokeToken.id));
    const context = createLintContext(new Map([[strokeToken.id, strokeToken]]));

    const findings = wrongScopeRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'wrong-scope',
        ruleTitle: 'Wrong scope',
        severity: 'error',
        nodeId: 'node:1',
        nodeName: 'Node',
        propertyLabel: 'Fill',
        valueLabel: 'color/background/disabled · t2',
        message: "Variable scopes don't cover text fills.",
      },
    ]);
  });

  it('passes when the scopes cover the property', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({
      scopes: ['FRAME_FILL', 'SHAPE_FILL'],
    });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', token.id));
    const context = createLintContext(new Map([[token.id, token]]));

    expect(
      wrongScopeRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes scope-free variables everywhere', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({ scopes: [] });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', token.id));
    const context = createLintContext(new Map([[token.id, token]]));

    expect(
      wrongScopeRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes ALL_FILLS variables on any fill', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({ scopes: ['ALL_FILLS'] });
    const node = lintNode({ type: 'TEXT' });
    const property = colorProperty('fill', hexPart('#FFFFFF', token.id));
    const context = createLintContext(new Map([[token.id, token]]));

    expect(
      wrongScopeRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('checks padding against the GAP scope (no PADDING scope in Figma)', () => {
    const spacingToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'spacing/md',
      scopes: ['GAP'],
    });
    const node = lintNode({ type: 'FRAME' });
    const property = numberProperty('padding', numberPart(16, spacingToken.id));
    const context = createLintContext(new Map([[spacingToken.id, spacingToken]]));

    expect(
      wrongScopeRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('skips parts without bound variables', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#FFFFFF'));

    expect(
      wrongScopeRule.evaluate(
        observation(node, property, property.parts[0]!),
        createLintContext(new Map()),
      ),
    ).toEqual([]);
  });

  it('skips unresolvable (deleted) variables', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#FFFFFF', 'VariableID:gone'));

    expect(
      wrongScopeRule.evaluate(
        observation(node, property, property.parts[0]!),
        createLintContext(new Map()),
      ),
    ).toEqual([]);
  });
});
