import { describe, expect, it } from 'vitest';
import { topologicalSortPackages } from './topological-sort-packages.ts';

describe('topologicalSortPackages', () => {
  it('orders dependencies before dependants', () => {
    const sorted = topologicalSortPackages([
      { name: '@scope/b', dependencies: { '@scope/a': '0.0.0' } },
      { name: '@scope/a', dependencies: {} },
    ]);

    expect(sorted.map((pkg): string => pkg.name)).toEqual(['@scope/a', '@scope/b']);
  });

  it('keeps deterministic order when no dependencies exist', () => {
    const sorted = topologicalSortPackages([
      { name: '@scope/c', dependencies: {} },
      { name: '@scope/a', dependencies: {} },
      { name: '@scope/b', dependencies: {} },
    ]);

    expect(sorted.map((pkg): string => pkg.name)).toEqual(['@scope/a', '@scope/b', '@scope/c']);
  });

  it('throws when cyclic dependencies exist', () => {
    expect(() =>
      topologicalSortPackages([
        { name: '@scope/a', dependencies: { '@scope/b': '0.0.0' } },
        { name: '@scope/b', dependencies: { '@scope/a': '0.0.0' } },
      ]),
    ).toThrow('Cyclic dependency detected');
  });
});
