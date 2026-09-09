import { describe, expect, it } from 'vitest';

import { detectVariants } from './variants.ts';

type NodeOverrides = Record<string, unknown>;

function fakeNode(overrides: NodeOverrides = {}): SceneNode {
  return {
    type: 'COMPONENT',
    name: 'size=24, filled=false',
    width: 24,
    height: 24,
    ...overrides,
  } as unknown as SceneNode;
}

function fakeComponent(overrides: NodeOverrides = {}): ComponentNode {
  return fakeNode(overrides) as unknown as ComponentNode;
}

function fakeSet(children: SceneNode[], overrides: NodeOverrides = {}): ComponentSetNode {
  return fakeNode({ type: 'COMPONENT_SET', children, ...overrides }) as unknown as ComponentSetNode;
}

describe('detectVariants', () => {
  it('uses a plain component as the outlined source', () => {
    const component = fakeComponent({ name: 'eye' });
    expect(detectVariants(component)).toEqual({ outlined: component, filled: null });
  });

  it('detects Filled=true and Filled=false variants', () => {
    const outlined = fakeComponent({ name: 'size=24, filled=false' });
    const filled = fakeComponent({ name: 'size=24, filled=true' });
    expect(detectVariants(fakeSet([outlined, filled]))).toEqual({ outlined, filled });
  });

  it('detects Filled=yes and Filled=no variants', () => {
    const outlined = fakeComponent({ name: 'filled=no' });
    const filled = fakeComponent({ name: 'filled=yes' });
    expect(detectVariants(fakeSet([outlined, filled]))).toEqual({ outlined, filled });
  });

  it('detects Outlined/Outline and Filled names', () => {
    const outlined = fakeComponent({ name: 'Outline' });
    const filled = fakeComponent({ name: 'filled' });
    expect(detectVariants(fakeSet([outlined, filled]))).toEqual({ outlined, filled });
  });

  it('gives priority to the Filled variant when a name matches both', () => {
    const both = fakeComponent({ name: 'filled=true outline' });
    const outlined = fakeComponent({ name: 'outlined' });
    const result = detectVariants(fakeSet([both, outlined]));
    expect(result.filled).toBe(both);
    expect(result.outlined).toBe(outlined);
  });

  it('keeps only the first variant of each style', () => {
    const outlined = fakeComponent({ name: 'filled=false' });
    const filled = fakeComponent({ name: 'filled=true' });
    const secondOutlined = fakeComponent({ name: 'outlined' });
    const result = detectVariants(fakeSet([outlined, filled, secondOutlined]));
    expect(result.outlined).toBe(outlined);
    expect(result.filled).toBe(filled);
  });

  it('ignores components whose width differs from the canvas size', () => {
    const small = fakeComponent({ name: 'filled=false', width: 16 });
    const result = detectVariants(fakeSet([small]));
    expect(result).toEqual({ outlined: null, filled: null });
  });

  it('falls back to the first canvas-width component when no variant name matches', () => {
    const generic = fakeComponent({ name: 'size=24' });
    const result = detectVariants(fakeSet([generic]));
    expect(result.outlined).toBe(generic);
    expect(result.filled).toBeNull();
  });

  it('falls back when only Filled variants exist', () => {
    const filled = fakeComponent({ name: 'filled=true' });
    const result = detectVariants(fakeSet([filled]));
    expect(result.outlined).toBe(filled);
    expect(result.filled).toBe(filled);
  });

  it('returns null sources for sets without canvas-width components', () => {
    const small = fakeComponent({ name: 'size=16', width: 16 });
    expect(detectVariants(fakeSet([small]))).toEqual({ outlined: null, filled: null });
  });
});
