import { describe, expect, it } from 'vitest';
import {
  topologicalSortPackages,
  type TopologicalPackageNode,
} from './topological-sort-packages.ts';

describe('topologicalSortPackages', () => {
  it('orders dependencies before dependants', () => {
    const sorted: readonly TopologicalPackageNode[] = topologicalSortPackages([
      { name: '@scope/b', dependencies: ['@scope/a'] },
      { name: '@scope/a', dependencies: [] },
    ]);

    expect(sorted.map((pkg: TopologicalPackageNode): string => pkg.name)).toEqual([
      '@scope/a',
      '@scope/b',
    ]);
  });

  it('keeps deterministic order when no dependencies exist', () => {
    const sorted: readonly TopologicalPackageNode[] = topologicalSortPackages([
      { name: '@scope/c', dependencies: [] },
      { name: '@scope/a', dependencies: [] },
      { name: '@scope/b', dependencies: [] },
    ]);

    expect(sorted.map((pkg: TopologicalPackageNode): string => pkg.name)).toEqual([
      '@scope/a',
      '@scope/b',
      '@scope/c',
    ]);
  });

  it('throws when cyclic dependencies exist', () => {
    expect(() =>
      topologicalSortPackages([
        { name: '@scope/a', dependencies: ['@scope/b'] },
        { name: '@scope/b', dependencies: ['@scope/a'] },
      ]),
    ).toThrow('Cyclic dependency detected');
  });
});
