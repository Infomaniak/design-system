export interface TopologicalPackageNode {
  readonly name: string;
  readonly dependencies: readonly string[];
}

export function topologicalSortPackages<TPackage extends TopologicalPackageNode>(
  packages: readonly TPackage[],
): readonly TPackage[] {
  const packagesByName: Map<string, TPackage> = new Map<string, TPackage>(
    packages.map((pkg: TPackage): readonly [string, TPackage] => [
      pkg.name,
      pkg,
    ]),
  );

  const inDegreeByName: Map<string, number> = new Map<string, number>();
  const dependantsByName: Map<string, string[]> = new Map<string, string[]>();

  for (const pkg of packages) {
    inDegreeByName.set(pkg.name, 0);
    dependantsByName.set(pkg.name, []);
  }

  for (const pkg of packages) {
    for (const dependencyName of pkg.dependencies) {
      if (!packagesByName.has(dependencyName)) {
        continue;
      }

      inDegreeByName.set(pkg.name, (inDegreeByName.get(pkg.name) ?? 0) + 1);
      dependantsByName.get(dependencyName)!.push(pkg.name);
    }
  }

  const queue: string[] = Array.from(inDegreeByName.entries())
    .filter(([, degree]: readonly [string, number]): boolean => degree === 0)
    .map(([name]: readonly [string, number]): string => name)
    .sort((a, b) => a.localeCompare(b));

  const sorted: TPackage[] = [];

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
