import { describe, expect, it } from 'vitest';
import { parseFixRequestItems } from './fix-request.ts';

const PAINT_FIX = {
  label: 'surface-primary',
  kind: 'paint',
  target: 'V:1',
  fields: ['fills'],
  paintIndex: 0,
};

const FIELD_FIX = {
  label: '16',
  kind: 'field',
  target: 'V:2',
  fields: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
};

describe('parseFixRequestItems', () => {
  it('parses a single-item request (single fix shape)', () => {
    expect(parseFixRequestItems([{ nodeId: 'node:1', fix: PAINT_FIX }])).toEqual([
      { nodeId: 'node:1', fix: PAINT_FIX },
    ]);
  });

  it('parses a batch request', () => {
    const items = [
      { nodeId: 'node:1', fix: PAINT_FIX },
      { nodeId: 'node:2', fix: FIELD_FIX },
    ];

    expect(parseFixRequestItems(items)).toEqual(items);
  });

  it('rejects non-array payloads', () => {
    expect((): unknown => parseFixRequestItems({ nodeId: 'node:1' })).toThrow(
      'Invalid fix request: expected an array of items.',
    );
    expect((): unknown => parseFixRequestItems(undefined)).toThrow();
  });

  it('rejects invalid item shapes', () => {
    expect((): unknown => parseFixRequestItems(['nope'])).toThrow('expected an object');
    expect((): unknown => parseFixRequestItems([{ fix: PAINT_FIX }])).toThrow('nodeId');
    expect((): unknown => parseFixRequestItems([{ nodeId: '', fix: PAINT_FIX }])).toThrow('nodeId');
    expect((): unknown => parseFixRequestItems([{ nodeId: 'node:1' }])).toThrow('fix object');
  });

  it('rejects invalid fix shapes', () => {
    const cases: readonly unknown[] = [
      { nodeId: 'n', fix: { ...PAINT_FIX, label: '' } },
      { nodeId: 'n', fix: { ...PAINT_FIX, kind: 'magic' } },
      { nodeId: 'n', fix: { ...PAINT_FIX, target: '' } },
      { nodeId: 'n', fix: { ...FIELD_FIX, fields: [] } },
      { nodeId: 'n', fix: { ...FIELD_FIX, fields: [''] } },
      { nodeId: 'n', fix: { ...PAINT_FIX, paintIndex: -1 } },
      { nodeId: 'n', fix: { ...PAINT_FIX, paintIndex: 0.5 } },
      { nodeId: 'n', fix: { label: 'x', kind: 'field', target: 'V', fields: 'nope' } },
      { nodeId: 'n', fix: { label: 'x', kind: 'paint', target: 'V', paintIndex: 0, fields: 42 } },
    ];

    for (const item of cases) {
      expect((): unknown => parseFixRequestItems([item])).toThrow('Invalid fix request');
    }
  });

  it('accepts a paint fix without fields (defaults applied by the glue)', () => {
    const fix = { label: 'x', kind: 'paint', target: 'V:1', paintIndex: 1 };

    expect(parseFixRequestItems([{ nodeId: 'n', fix }])).toEqual([
      { nodeId: 'n', fix: { ...fix, fields: undefined } },
    ]);
  });
});
