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
import { unknownCollectionRule } from './unknown-collection.ts';

describe('unknown-collection rule', () => {
  it('flags a resolved variable from an unrecognized collection', () => {
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'foreground',
      collectionName: 'theme',
      tier: 'unknown',
    });
    const node = lintNode({ id: 'node:1', name: 'Card' });
    const property = colorProperty('fill', hexPart('#000000', kitToken.id));
    const context = createLintContext(new Map([[kitToken.id, kitToken]]));

    const findings = unknownCollectionRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'unknown-collection',
        ruleTitle: 'Unknown collection',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'Card',
        propertyLabel: 'Fill',
        valueLabel: 'foreground · theme',
        message: 'Bound token comes from collection “theme” — expected t1/t2/t3.',
      },
    ]);
  });

  it('flags a variable whose collection could not be resolved', () => {
    const libraryToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:2',
      name: 'gray/900',
      collectionName: '',
      tier: 'unknown',
    });
    const node = lintNode();
    const property = colorProperty('stroke', hexPart('#000000', libraryToken.id));
    const context = createLintContext(new Map([[libraryToken.id, libraryToken]]));

    const findings = unknownCollectionRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.valueLabel).toBe('gray/900');
    expect(findings[0]!.message).toBe(
      'Bound token’s collection could not be resolved — expected t1/t2/t3.',
    );
  });

  it('flags unknown-tier variables on number properties too', () => {
    const kitSpacing: ReturnType<typeof variableInfo> = variableInfo({
      name: 'spacing/16',
      collectionName: 'theme',
      tier: 'unknown',
    });
    const node = lintNode();
    const property = numberProperty('gap', numberPart(12, kitSpacing.id));
    const context = createLintContext(new Map([[kitSpacing.id, kitSpacing]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('passes t1, t2 and t3 variables', () => {
    const tiers: readonly ('t1' | 't2' | 't3')[] = ['t1', 't2', 't3'];

    for (const tier of tiers) {
      const token: ReturnType<typeof variableInfo> = variableInfo({
        id: `VariableID:${tier}`,
        collectionName: tier,
        tier,
      });
      const node = lintNode();
      const property = colorProperty('fill', hexPart('#000000', token.id));
      const context = createLintContext(new Map([[token.id, token]]));

      expect(
        unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toEqual([]);
    }
  });

  it('passes unknown-tier variables whose alias chain resolves to a known tier', () => {
    const targets: readonly ('t1' | 't2' | 't3')[] = ['t1', 't2', 't3'];

    for (const tier of targets) {
      const target: ReturnType<typeof variableInfo> = variableInfo({
        id: `V:target:${tier}`,
        collectionName: tier,
        tier,
      });
      const kitToken: ReturnType<typeof variableInfo> = variableInfo({
        id: `V:kit:${tier}`,
        collectionName: 'mode',
        tier: 'unknown',
        aliasTargetId: target.id,
      });
      const node = lintNode();
      const property = colorProperty('fill', hexPart('#000000', kitToken.id));
      const context = createLintContext(
        new Map([
          [kitToken.id, kitToken],
          [target.id, target],
        ]),
      );

      expect(
        unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toEqual([]);
    }
  });

  it('flags unknown-tier variables whose alias chain dead-ends', () => {
    const kitToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:gone',
    });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', kitToken.id));
    const context = createLintContext(new Map([[kitToken.id, kitToken]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('flags unknown-tier variables on alias cycles', () => {
    const first: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:a',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:b',
    });
    const second: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:b',
      collectionName: 'mode',
      tier: 'unknown',
      aliasTargetId: 'V:a',
    });
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', first.id));
    const context = createLintContext(
      new Map([
        [first.id, first],
        [second.id, second],
      ]),
    );

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('skips parts without bound variables and unresolvable ids', () => {
    const node = lintNode();
    const unbound = colorProperty('fill', hexPart('#000000'));
    const deleted = colorProperty('fill', hexPart('#000000', 'VariableID:gone'));
    const context = createLintContext(new Map());

    expect(
      unknownCollectionRule.evaluate(observation(node, unbound, unbound.parts[0]!), context),
    ).toEqual([]);
    expect(
      unknownCollectionRule.evaluate(observation(node, deleted, deleted.parts[0]!), context),
    ).toEqual([]);
  });
});
