import { describe, expect, it } from 'vitest';
import {
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  textStylePart,
  textStyleProperty,
} from '../testing/fixtures.ts';
import { collectTextStyleIds } from './collect-text-style-ids.ts';

describe('collectTextStyleIds', () => {
  it('collects distinct style ids from text-style parts across the tree', () => {
    const tree = lintNode({
      id: 'root',
      type: 'TEXT',
      properties: [
        textStyleProperty(textStylePart({ styleId: 'S:1' })),
        textStyleProperty(textStylePart({ styleId: 'S:2' })),
      ],
      children: [
        lintNode({
          id: 'child',
          type: 'TEXT',
          properties: [textStyleProperty(textStylePart({ styleId: 'S:1' }))],
        }),
      ],
    });

    expect(collectTextStyleIds([tree])).toEqual(['S:1', 'S:2']);
  });

  it('ignores unstyled text and other properties', () => {
    const tree = lintNode({
      type: 'TEXT',
      properties: [textStyleProperty(textStylePart()), numberProperty('padding', numberPart(16))],
      children: [lintNode({ properties: [numberProperty('gap', numberPart(8))] })],
    });

    expect(collectTextStyleIds([tree])).toEqual([]);
  });

  it('skips hidden nodes and their subtrees', () => {
    const tree = lintNode({
      visible: false,
      type: 'TEXT',
      properties: [textStyleProperty(textStylePart({ styleId: 'S:1' }))],
      children: [
        lintNode({
          type: 'TEXT',
          properties: [textStyleProperty(textStylePart({ styleId: 'S:2' }))],
        }),
      ],
    });

    expect(collectTextStyleIds([tree])).toEqual([]);
  });

  it('returns no ids for an empty forest or non-text properties', () => {
    expect(collectTextStyleIds([])).toEqual([]);
    expect(
      collectTextStyleIds([lintNode({ properties: [textStyleProperty(hexPart('#FFFFFF'))] })]),
    ).toEqual([]);
  });
});
