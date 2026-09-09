import { describe, expect, it } from 'vitest';

import {
  findCanvasVariant,
  hasStrokesDeeply,
  isCanvasSize,
  isComponentOrSet,
  isGenerated,
  validateSelection,
  validateSingleIcon,
} from './validation.ts';

type NodeOverrides = Record<string, unknown>;

function fakeNode(overrides: NodeOverrides = {}): SceneNode {
  return {
    type: 'COMPONENT',
    name: 'icon',
    width: 24,
    height: 24,
    strokes: [],
    ...overrides,
  } as unknown as SceneNode;
}

function fakeComponent(overrides: NodeOverrides = {}): ComponentNode {
  return fakeNode(overrides) as unknown as ComponentNode;
}

function fakeSet(children: SceneNode[], overrides: NodeOverrides = {}): ComponentSetNode {
  return fakeNode({ type: 'COMPONENT_SET', children, ...overrides }) as unknown as ComponentSetNode;
}

describe('isComponentOrSet', () => {
  it('accepts components', () => {
    expect(isComponentOrSet(fakeNode({ type: 'COMPONENT' }))).toBe(true);
  });

  it('accepts component sets', () => {
    expect(isComponentOrSet(fakeNode({ type: 'COMPONENT_SET' }))).toBe(true);
  });

  it('rejects other node types', () => {
    expect(isComponentOrSet(fakeNode({ type: 'FRAME' }))).toBe(false);
  });
});

describe('isCanvasSize', () => {
  it('accepts exact 24x24 nodes', () => {
    expect(isCanvasSize({ width: 24, height: 24 })).toBe(true);
  });

  it('accepts nodes within the tolerance', () => {
    expect(isCanvasSize({ width: 23.95, height: 24.05 })).toBe(true);
  });

  it('rejects undersized nodes', () => {
    expect(isCanvasSize({ width: 16, height: 16 })).toBe(false);
  });

  it('rejects nodes with only one matching dimension', () => {
    expect(isCanvasSize({ width: 24, height: 32 })).toBe(false);
  });
});

describe('isGenerated', () => {
  it('detects generated names', () => {
    expect(isGenerated('eye [generated]')).toBe(true);
  });

  it('accepts regular names', () => {
    expect(isGenerated('eye')).toBe(false);
  });
});

describe('findCanvasVariant', () => {
  it('returns the first 24x24 component child', () => {
    const variant = fakeComponent({ name: 'size=24', width: 24, height: 24 });
    const other = fakeComponent({ name: 'size=16', width: 16, height: 16 });
    expect(findCanvasVariant(fakeSet([other, variant]))).toBe(variant);
  });

  it('ignores non-component children', () => {
    const frame = fakeNode({ type: 'FRAME', width: 24, height: 24 });
    expect(findCanvasVariant(fakeSet([frame]))).toBeNull();
  });

  it('returns null when no variant matches the canvas size', () => {
    const small = fakeComponent({ name: 'size=16', width: 16, height: 16 });
    expect(findCanvasVariant(fakeSet([small]))).toBeNull();
  });
});

describe('hasStrokesDeeply', () => {
  it('detects direct strokes', () => {
    expect(hasStrokesDeeply(fakeNode({ strokes: [{ type: 'SOLID' }] }))).toBe(true);
  });

  it('detects strokes nested in children', () => {
    const child = fakeNode({
      type: 'FRAME',
      children: [fakeNode({ strokes: [{ type: 'SOLID' }] })],
    });
    expect(hasStrokesDeeply(child)).toBe(true);
  });

  it('returns false when no descendant has strokes', () => {
    const child = fakeNode({ type: 'FRAME', children: [fakeNode({ name: 'leaf' })] });
    expect(hasStrokesDeeply(child)).toBe(false);
  });
});

describe('validateSingleIcon', () => {
  it('accepts a valid component', () => {
    const component = fakeComponent({ name: 'eye', strokes: [{ type: 'SOLID' }] });
    expect(validateSingleIcon(component)).toEqual({
      name: 'eye',
      type: 'COMPONENT',
      valid: true,
      reason: null,
      currentSize: undefined,
    });
  });

  it('rejects already generated components', () => {
    const component = fakeComponent({ name: 'eye [generated]', strokes: [{ type: 'SOLID' }] });
    expect(validateSingleIcon(component).reason).toBe('already-generated');
  });

  it('rejects components with the wrong size and reports it', () => {
    const component = fakeComponent({ width: 16, height: 16, strokes: [{ type: 'SOLID' }] });
    expect(validateSingleIcon(component).reason).toBe('not-24x24');
    expect(validateSingleIcon(component).currentSize).toBe('16×16');
  });

  it('rejects component sets without a 24x24 variant', () => {
    const small = fakeComponent({
      name: 'size=16',
      width: 16,
      height: 16,
      strokes: [{ type: 'SOLID' }],
    });
    expect(validateSingleIcon(fakeSet([small])).reason).toBe('no-24x24-variant');
  });

  it('rejects component sets whose 24x24 variant has no strokes', () => {
    const variant = fakeComponent({ name: 'size=24', width: 24, height: 24, strokes: [] });
    expect(validateSingleIcon(fakeSet([variant])).reason).toBe('no-strokes');
  });

  it('accepts component sets through their 24x24 variant', () => {
    const small = fakeComponent({ name: 'size=16', width: 16, height: 16, strokes: [] });
    const variant = fakeComponent({
      name: 'size=24',
      width: 24,
      height: 24,
      strokes: [{ type: 'SOLID' }],
    });
    expect(validateSingleIcon(fakeSet([small, variant])).valid).toBe(true);
  });

  it('rounds the reported size', () => {
    const component = fakeComponent({ width: 23.4, height: 24.6, strokes: [{ type: 'SOLID' }] });
    expect(validateSingleIcon(component).currentSize).toBe('23×25');
  });
});

describe('validateSelection', () => {
  it('summarizes a mixed selection', () => {
    const valid = fakeComponent({ name: 'eye', strokes: [{ type: 'SOLID' }] });
    const wrongSize = fakeComponent({ name: 'bolt', width: 16, height: 16 });
    const frame = fakeNode({ type: 'FRAME', name: 'frame' });

    const summary = validateSelection([valid, wrongSize, frame]);
    expect(summary.validCount).toBe(1);
    expect(summary.icons).toHaveLength(3);
    expect(summary.icons[0].valid).toBe(true);
    expect(summary.icons[1].reason).toBe('not-24x24');
    expect(summary.icons[2].reason).toBe('not-a-component');
  });

  it('handles an empty selection', () => {
    expect(validateSelection([])).toEqual({ icons: [], validCount: 0 });
  });
});
