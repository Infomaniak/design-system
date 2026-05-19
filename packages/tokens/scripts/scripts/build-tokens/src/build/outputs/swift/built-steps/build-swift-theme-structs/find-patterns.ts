import {
  nameForPatternPaths,
  normalize,
  type NestedMap,
} from './LEGACY/find-repeated-structures.ts';

export function findPatterns(tree: NestedMap): Map<string, string[]> {
  const leafGroup = buildLeafPathMap(tree);
  return invertMap(leafGroup);
}

export function getSharedStructName(
  node: NestedMap,
  patterns: Map<string, string[]>,
): string | undefined {
  const signature = JSON.stringify(normalize(node));
  const pathJsonList = patterns.get(signature);
  if (!pathJsonList) return undefined;
  const paths = pathJsonList.map((pathJson) => JSON.parse(pathJson) as string[]);
  return nameForPatternPaths(paths);
}

function isLeafGroup(node: NestedMap | string): boolean {
  return typeof node === 'object' && Object.values(node).every((v) => typeof v === 'string');
}

function buildLeafPathMap(obj: NestedMap): Map<string, string> {
  const result = new Map<string, string>();

  function walk(node: NestedMap | string, pathSegments: string[]) {
    if (typeof node === 'string') return;

    if (isLeafGroup(node)) {
      result.set(JSON.stringify(pathSegments), stableStringify(node));
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      walk(child, [...pathSegments, key]);
    }
  }

  walk(obj, []);
  return result;
}

function invertMap(map: Map<string, string>): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const [key, value] of map) {
    const keys = result.get(value) ?? [];
    keys.push(key);

    result.set(value, keys);
  }

  for (const [value, keys] of result) {
    if (keys.length <= 1) result.delete(value);
  }
  return result;
}

function stableStringify(node: NestedMap | Record<string, string>): string {
  return JSON.stringify(normalize(node));
}
