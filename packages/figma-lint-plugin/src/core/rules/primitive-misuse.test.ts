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
import { primitiveMisuseRule } from './primitive-misuse.ts';

describe('primitive-misuse rule', () => {
  it('flags a t1 variable bound to a property', () => {
    const primitiveToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'color/gray/900',
      collectionName: 't1',
      tier: 't1',
    });
    const node = lintNode({ id: 'node:1', name: 'Card' });
    const property = colorProperty('fill', hexPart('#000000', primitiveToken.id));
    const context = createLintContext(new Map([[primitiveToken.id, primitiveToken]]));

    const findings = primitiveMisuseRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'primitive-misuse',
        ruleTitle: 'Primitive misuse',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'Card',
        propertyLabel: 'Fill',
        valueLabel: 'color/gray/900 · t1',
        message: 'Bound token resolves to a primitive (t1) token — prefer a semantic (t2) token.',
      },
    ]);
  });

  it('flags an unknown-tier variable whose alias chain resolves to t1', () => {
    const primitiveToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'color/gray/900',
      collectionName: 't1',
      tier: 't1',
    });
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      name: 'foreground',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: primitiveToken.id,
    });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', kitToken.id));
    const context = createLintContext(
      new Map([
        [kitToken.id, kitToken],
        [primitiveToken.id, primitiveToken],
      ]),
    );

    const findings = primitiveMisuseRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.valueLabel).toBe('foreground · mode');
  });

  it('passes an unknown-tier variable whose alias chain resolves to t2', () => {
    const semanticToken: ReturnType<typeof variableInfo> = variableInfo({ tier: 't2' });
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: semanticToken.id,
    });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', kitToken.id));
    const context = createLintContext(
      new Map([
        [kitToken.id, kitToken],
        [semanticToken.id, semanticToken],
      ]),
    );

    expect(
      primitiveMisuseRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes t2 variables', () => {
    const semanticToken: ReturnType<typeof variableInfo> = variableInfo({ tier: 't2' });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', semanticToken.id));
    const context = createLintContext(new Map([[semanticToken.id, semanticToken]]));

    expect(
      primitiveMisuseRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes t3 variables', () => {
    const componentToken: ReturnType<typeof variableInfo> = variableInfo({ tier: 't3' });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', componentToken.id));
    const context = createLintContext(new Map([[componentToken.id, componentToken]]));

    expect(
      primitiveMisuseRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes unknown-tier variables', () => {
    const unknownToken: ReturnType<typeof variableInfo> = variableInfo({
      collectionName: 'theme',
      tier: 'unknown',
    });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', unknownToken.id));
    const context = createLintContext(new Map([[unknownToken.id, unknownToken]]));

    expect(
      primitiveMisuseRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('flags t1 variables on number properties too', () => {
    const primitiveSpacing: ReturnType<typeof variableInfo> = variableInfo({
      name: 'spacing/16',
      collectionName: 't1',
      tier: 't1',
    });
    const node = lintNode();
    const property = numberProperty('cornerRadius', numberPart(8, primitiveSpacing.id));
    const context = createLintContext(new Map([[primitiveSpacing.id, primitiveSpacing]]));

    expect(
      primitiveMisuseRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('skips parts without bound variables and unresolvable ids', () => {
    const node = lintNode();
    const unbound = colorProperty('fill', hexPart('#000000'));
    const deleted = colorProperty('fill', hexPart('#000000', 'VariableID:gone'));
    const context = createLintContext(new Map());

    expect(
      primitiveMisuseRule.evaluate(observation(node, unbound, unbound.parts[0]!), context),
    ).toEqual([]);
    expect(
      primitiveMisuseRule.evaluate(observation(node, deleted, deleted.parts[0]!), context),
    ).toEqual([]);
  });
});
