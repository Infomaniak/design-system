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

  it('lintNode applies every provided option', () => {
    const child = lintNode({ id: 'node:child' });
    const node = lintNode({
      id: 'node:2',
      name: 'Card',
      type: 'INSTANCE',
      visible: false,
      fromIconLibrary: true,
      properties: [],
      children: [child],
    });

    expect(node.id).toBe('node:2');
    expect(node.name).toBe('Card');
    expect(node.type).toBe('INSTANCE');
    expect(node.visible).toBe(false);
    expect(node.fromIconLibrary).toBe(true);
    expect(node.children).toEqual([child]);
  });

  it('variableInfo applies value and alias options', () => {
    const variable: ReturnType<typeof variableInfo> = variableInfo({
      id: 'V:kit',
      name: 'foreground',
      collectionName: 'theme',
      tier: 'unknown',
      scopes: ['ALL_FILLS'],
      remote: false,
      value: { r: 0, g: 0, b: 0, a: 1 },
      aliasTargetId: 'V:1',
    });

    expect(variable.id).toBe('V:kit');
    expect(variable.collectionName).toBe('theme');
    expect(variable.tier).toBe('unknown');
    expect(variable.remote).toBe(false);
    expect(variable.value).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(variable.aliasTargetId).toBe('V:1');
  });
});
