import { describe, expect, it } from 'vitest';
import type { AnyFigmaNode } from './figma-types.ts';
import { collectInstanceIdentities } from './instance-identities.ts';

function instance(id: string, name: string, mainComponent?: AnyFigmaNode | null): AnyFigmaNode {
  return {
    id,
    name,
    type: 'INSTANCE',
    ...(mainComponent === undefined
      ? {}
      : { getMainComponentAsync: async (): Promise<AnyFigmaNode | null> => mainComponent }),
  };
}

describe('collectInstanceIdentities', () => {
  it('resolves component and component-set names through getMainComponentAsync', async () => {
    const tree: readonly AnyFigmaNode[] = [
      instance('I:1', 'Button', {
        id: 'C:1',
        name: 'Primary',
        type: 'COMPONENT',
        parent: { name: 'Buttons' },
        remote: true,
      }),
    ];

    const identities = await collectInstanceIdentities(tree);

    expect(identities.get('I:1')).toEqual({
      componentName: 'Primary',
      componentSetName: 'Buttons',
      remote: true,
    });
  });

  it('resolves a component without a parent (flat component)', async () => {
    const identities = await collectInstanceIdentities([
      instance('I:1', 'icon', { id: 'C:1', name: 'esds/icon/plus', type: 'COMPONENT' }),
    ]);

    expect(identities.get('I:1')).toEqual({ componentName: 'esds/icon/plus', remote: false });
  });

  it('resolves kit-named instances too — provenance must be verified, not trusted', async () => {
    let called: boolean = false;
    const node: AnyFigmaNode = {
      id: 'I:1',
      name: 'esds/icon/plus',
      type: 'INSTANCE',
      getMainComponentAsync: async (): Promise<AnyFigmaNode | null> => {
        called = true;
        return {
          id: 'C:1',
          name: 'size=24',
          type: 'COMPONENT',
          parent: { name: 'esds/icon/plus' },
          remote: true,
        };
      },
    };

    const identities = await collectInstanceIdentities([node]);

    expect(called).toBe(true);
    expect(identities.get('I:1')).toEqual({
      componentName: 'size=24',
      componentSetName: 'esds/icon/plus',
      remote: true,
    });
  });

  it('captures the remote flag off the main component (local component → false)', async () => {
    const identities = await collectInstanceIdentities([
      instance('I:1', 'Local copy', {
        id: 'C:1',
        name: 'esds/icon/plus',
        type: 'COMPONENT',
        remote: false,
      }),
    ]);

    expect(identities.get('I:1')).toEqual({ componentName: 'esds/icon/plus', remote: false });
  });

  it('ignores detached instances and instances without the async accessor', async () => {
    const identities = await collectInstanceIdentities([
      instance('I:1', 'Detached', null),
      instance('I:2', 'No accessor'),
    ]);

    expect(identities.size).toBe(0);
  });

  it('walks nested instances inside frames and instances', async () => {
    const tree: readonly AnyFigmaNode[] = [
      {
        id: 'F:1',
        name: 'Frame',
        type: 'FRAME',
        children: [
          instance('I:1', 'Inner icon', { id: 'C:1', name: 'esds/icon/close', type: 'COMPONENT' }),
        ],
      },
      {
        id: 'I:2',
        name: 'Outer instance',
        type: 'INSTANCE',
        children: [instance('I:3', 'Nested', { id: 'C:2', name: 'Card', type: 'COMPONENT' })],
      },
    ];

    const identities = await collectInstanceIdentities(tree);

    expect(identities.has('I:1')).toBe(true);
    expect(identities.has('I:3')).toBe(true);
    expect(identities.size).toBe(2);
  });

  it('returns an empty map for a forest without instances', async () => {
    const tree: readonly AnyFigmaNode[] = [
      { id: 'F:1', name: 'Frame', type: 'FRAME', children: [] },
    ];

    expect((await collectInstanceIdentities(tree)).size).toBe(0);
    expect((await collectInstanceIdentities([])).size).toBe(0);
  });
});
