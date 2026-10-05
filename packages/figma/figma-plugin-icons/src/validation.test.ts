import { describe, expect, it } from 'vitest';

import {
  hasStrokesDeeply,
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
    children: [],
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

describe('isGenerated', () => {
  it('detects generated names', () => {
    expect(isGenerated('eye [generated]')).toBe(true);
  });

  it('accepts regular names', () => {
    expect(isGenerated('eye')).toBe(false);
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
    const component = fakeComponent({
      name: 'eye',
      children: [fakeNode({ strokes: [{ type: 'SOLID' }] })],
    });
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

  it('rejects childless components even when they carry their own strokes', () => {
    const component = fakeComponent({ name: 'eye', strokes: [{ type: 'SOLID' }] });
    expect(validateSingleIcon(component).reason).toBe('empty');
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
    const variant = fakeComponent({ name: 'size=24', children: [fakeNode({ name: 'child' })] });
    expect(validateSingleIcon(fakeSet([variant])).reason).toBe('no-strokes');
  });

  it('rejects sets whose named Filled variant would generate an empty icon', () => {
    const outlined = fakeComponent({
      name: 'filled=false',
      children: [fakeNode({ strokes: [{ type: 'SOLID' }] })],
    });
    const filled = fakeComponent({
      name: 'filled=true',
      children: [fakeNode({ name: 'child' })],
    });
    expect(validateSingleIcon(fakeSet([outlined, filled])).reason).toBe('no-strokes');
  });

  it('ignores named variants whose height differs from the canvas size', () => {
    const wrongHeight = fakeComponent({
      name: 'filled=false',
      width: 24,
      height: 16,
      strokes: [{ type: 'SOLID' }],
    });
    const fallback = fakeComponent({
      name: 'size=24',
      children: [fakeNode({ strokes: [{ type: 'SOLID' }] })],
    });
    expect(validateSingleIcon(fakeSet([wrongHeight, fallback])).valid).toBe(true);
  });

  it('accepts component sets through their 24x24 variant', () => {
    const small = fakeComponent({ name: 'size=16', width: 16, height: 16, strokes: [] });
    const variant = fakeComponent({
      name: 'size=24',
      children: [fakeNode({ strokes: [{ type: 'SOLID' }] })],
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
    const valid = fakeComponent({
      name: 'eye',
      children: [fakeNode({ strokes: [{ type: 'SOLID' }] })],
    });
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
