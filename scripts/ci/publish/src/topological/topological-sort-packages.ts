import type { PackageJson } from '../../../../helpers/file/package-json/package-json.ts';

/**
 * @deprecated use yarn workspace instead
 */
export function topologicalSortPackages<
  GPackage extends Pick<PackageJson, 'name' | 'dependencies'>,
>(packages: readonly GPackage[]): readonly GPackage[] {
  // TODO improve algorithm
  const packagesByName: Map<string, GPackage> = new Map<string, GPackage>(
    packages.map((pkg: GPackage): readonly [string, GPackage] => [pkg.name, pkg]),
  );

  const inDegreeByName: Map<string, number> = new Map<string, number>();
  const dependantsByName: Map<string, string[]> = new Map<string, string[]>();

  for (const pkg of packages) {
    inDegreeByName.set(pkg.name, 0);
    dependantsByName.set(pkg.name, []);
  }

  for (const { name, dependencies } of packages) {
    const dependencyList: readonly string[] =
      dependencies === undefined ? [] : Object.keys(dependencies);

    for (const dependencyName of dependencyList) {
      if (!packagesByName.has(dependencyName)) {
        continue;
      }

      inDegreeByName.set(name, (inDegreeByName.get(name) ?? 0) + 1);
      dependantsByName.get(dependencyName)!.push(name);
    }
  }

  const queue: string[] = Array.from(inDegreeByName.entries())
    .filter(([, degree]: readonly [string, number]): boolean => degree === 0)
    .map(([name]: readonly [string, number]): string => name)
    .sort((a, b) => a.localeCompare(b));

  const sorted: GPackage[] = [];

  while (queue.length > 0) {
    const name: string = queue.shift()!;
    sorted.push(packagesByName.get(name)!);

    for (const dependantName of dependantsByName.get(name) ?? []) {
      const nextInDegree: number = (inDegreeByName.get(dependantName) ?? 0) - 1;
      inDegreeByName.set(dependantName, nextInDegree);

      if (nextInDegree === 0) {
        queue.push(dependantName);
        queue.sort((a, b) => a.localeCompare(b));
      }
    }
  }

  if (sorted.length !== packages.length) {
    throw new Error('Cyclic dependency detected between publishable packages.');
  }

  return sorted;
}
