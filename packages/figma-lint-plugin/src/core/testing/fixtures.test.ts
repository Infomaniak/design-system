import { describe, expect, it } from 'vitest';
import { lintNode, variableInfo } from './fixtures.ts';

describe('fixtures', () => {
  it('variableInfo defaults to a semantic content token', () => {
    const variable: ReturnType<typeof variableInfo> = variableInfo();

    expect(variable.id).toBe('color/content/primary');
    expect(variable.nameSegments).toEqual(['color', 'content', 'primary']);
    expect(variable.collectionName).toBe('t2');
    expect(variable.tier).toBe('t2');
    expect(variable.scopes).toEqual([]);
  });

  it('variableInfo splits the provided name into segments', () => {
    const variable: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/background/brand/default',
      collectionName: 't2',
      tier: 't2',
      scopes: ['ALL_FILLS'],
    });

    expect(variable.nameSegments).toEqual(['color', 'background', 'brand', 'default']);
    expect(variable.id).toBe('color/background/brand/default');
    expect(variable.scopes).toEqual(['ALL_FILLS']);
  });

  it('lintNode defaults to a visible empty frame', () => {
    const node = lintNode();

    expect(node.id).toBe('node:1');
    expect(node.name).toBe('Node');
    expect(node.type).toBe('FRAME');
    expect(node.visible).toBe(true);
    expect(node.properties).toEqual([]);
    expect(node.children).toEqual([]);
  });
});
