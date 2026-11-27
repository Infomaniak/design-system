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
      collectionName: 'third-party',
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
        valueLabel: 'foreground · third-party',
        message: 'Bound token comes from collection “third-party” — expected t1/t2/t3.',
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
      collectionName: 'third-party',
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

  it('skips bindings inside DS icon library instances', () => {
    const node = lintNode({ fromIconLibrary: true, name: 'glyph' });
    const property = colorProperty('fill', hexPart('#000000', 'VariableID:kit'));
    const context = createLintContext(new Map());

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('flags icon-named nodes not marked as library instances (local copies)', () => {
    // An in-file component reusing the `esds/icon/…` convention is a
    // duplicate: the adapter only marks instances of remote (published) main
    // components, so this node's bindings are surfaced.
    const kitToken = variableInfo({
      id: 'VariableID:kit',
      name: 'stroke-width/2',
      collectionName: 'Collection 1',
      tier: 'unknown',
    });
    const node = lintNode({ name: 'esds/icon/plus', type: 'INSTANCE' });
    const property = colorProperty('fill', hexPart('#000000', 'VariableID:kit'));
    const context = createLintContext(new Map([['VariableID:kit', kitToken]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('flags raw palette collections shipped inside kit libraries', () => {
    // Edelweiss-published, but a raw palette step (`Red/100`) should still
    // warn — the kit counterpart of primitive-misuse for t1 tokens.
    const paletteStep = variableInfo({
      name: 'Red/100',
      collectionName: 'Primitives',
      tier: 'unknown',
      remote: true,
      knownKit: true,
    });
    const node = lintNode({ name: 'Android card' });
    const property = colorProperty('fill', hexPart('#ff0000', 'VariableID:palette'));
    const context = createLintContext(new Map([['VariableID:palette', paletteStep]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('still flags non-icon nodes bound to unknown collections', () => {
    const kitToken = variableInfo({
      id: 'VariableID:kit',
      name: 'border-width/md',
      collectionName: 'Collection 1',
      tier: 'unknown',
    });
    const node = lintNode({ name: 'glyph' });
    const property = colorProperty('fill', hexPart('#000000', 'VariableID:kit'));
    const context = createLintContext(new Map([['VariableID:kit', kitToken]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('passes remote bindings stamped from a known kit library (Token Core)', () => {
    for (const collectionName of ['theme', 'dataviz', 'product', 'button-size', 'badge-type']) {
      const kitToken = variableInfo({
        name: 'some/token',
        collectionName,
        tier: 'unknown',
        remote: true,
        knownKit: true,
      });
      const node = lintNode({ name: 'Android card' });
      const property = colorProperty('fill', hexPart('#e6eeff', 'VariableID:kit'));
      const context = createLintContext(new Map([['VariableID:kit', kitToken]]));

      expect(
        unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toEqual([]);
    }
  });

  it('passes remote Material scheme bindings (Schemes/… namespace)', () => {
    const schemeToken = variableInfo({
      name: 'Schemes/Surface Container',
      collectionName: 'Theme',
      tier: 'unknown',
      remote: true,
    });
    const node = lintNode({ name: 'Android card' });
    const property = colorProperty('fill', hexPart('#e6eeff', 'VariableID:scheme'));
    const context = createLintContext(new Map([['VariableID:scheme', schemeToken]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('flags local copies of kit collections', () => {
    // Remote-only exemption: a collection pasted into the file is a duplicate,
    // like a duplicated kit icon.
    const localCopy = variableInfo({
      name: 'Schemes/Primary',
      collectionName: 'Theme',
      tier: 'unknown',
      remote: false,
      knownKit: true,
    });
    const node = lintNode({ name: 'Card' });
    const property = colorProperty('fill', hexPart('#000000', 'VariableID:local'));
    const context = createLintContext(new Map([['VariableID:local', localCopy]]));

    expect(
      unknownCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });
});
