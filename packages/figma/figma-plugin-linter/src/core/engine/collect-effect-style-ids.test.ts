import { describe, expect, it } from 'vitest';
import {
  effectPart,
  effectProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
} from '../testing/fixtures.ts';
import { collectEffectStyleIds } from './collect-effect-style-ids.ts';

describe('collectEffectStyleIds', () => {
  it('collects distinct style ids from effect parts across the tree', () => {
    const tree = lintNode({
      id: 'root',
      properties: [effectProperty(effectPart({ styleId: 'S:1' }), effectPart({ styleId: 'S:2' }))],
      children: [
        lintNode({ id: 'child', properties: [effectProperty(effectPart({ styleId: 'S:1' }))] }),
      ],
    });

    expect(collectEffectStyleIds([tree])).toEqual(['S:1', 'S:2']);
  });

  it('ignores raw effects without a style id and other properties', () => {
    const tree = lintNode({
      properties: [
        effectProperty(effectPart({ effectType: 'DROP_SHADOW' })),
        effectProperty(effectPart({ boundVariableId: 'V:1' })),
        numberProperty('padding', numberPart(16)),
      ],
      children: [lintNode({ properties: [numberProperty('gap', numberPart(8))] })],
    });

    expect(collectEffectStyleIds([tree])).toEqual([]);
  });

  it('skips hidden nodes and their subtrees', () => {
    const tree = lintNode({
      visible: false,
      properties: [effectProperty(effectPart({ styleId: 'S:1' }))],
      children: [lintNode({ properties: [effectProperty(effectPart({ styleId: 'S:2' }))] })],
    });

    expect(collectEffectStyleIds([tree])).toEqual([]);
  });

  it('returns no ids for an empty forest', () => {
    expect(collectEffectStyleIds([])).toEqual([]);
  });

  it('ignores non-effect properties carrying the same part ids', () => {
    const tree = lintNode({
      properties: [numberProperty('padding', numberPart(4)), effectProperty(hexPart('#FFFFFF'))],
    });

    expect(collectEffectStyleIds([tree])).toEqual([]);
  });
});
