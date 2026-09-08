import { describe, expect, it } from 'vitest';
import {
  colorProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
} from '../testing/fixtures.ts';
import { collectBoundVariableIds } from './collect-bound-variable-ids.ts';

describe('collectBoundVariableIds', () => {
  it('collects distinct bound ids across nodes, properties and parts', () => {
    const tree = lintNode({
      id: 'root',
      properties: [
        colorProperty('fill', hexPart('#111111', 'V:1'), hexPart('#222222', 'V:2')),
        numberProperty('padding', numberPart(8, 'V:1'), numberPart(16)),
      ],
      children: [
        lintNode({
          id: 'child',
          properties: [numberProperty('gap', numberPart(12, 'V:3'))],
        }),
      ],
    });

    expect(collectBoundVariableIds([tree])).toEqual(['V:1', 'V:2', 'V:3']);
  });

  it('skips hidden nodes and unbound parts, collects instance bindings', () => {
    const tree = lintNode({
      id: 'root',
      properties: [colorProperty('fill', hexPart('#111111', 'V:visible'))],
      children: [
        lintNode({
          id: 'hidden',
          visible: false,
          properties: [colorProperty('fill', hexPart('#222222', 'V:hidden'))],
        }),
        lintNode({
          id: 'instance',
          type: 'INSTANCE',
          properties: [colorProperty('fill', hexPart('#333333', 'V:instance'))],
        }),
        lintNode({
          id: 'raw',
          properties: [colorProperty('fill', hexPart('#444444'))],
        }),
      ],
    });

    expect(collectBoundVariableIds([tree])).toEqual(['V:visible', 'V:instance']);
  });

  it('handles empty forests', () => {
    expect(collectBoundVariableIds([])).toEqual([]);
  });
});
