import type { SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import { toSwiftVariableName } from '../../swift-naming-helper.ts';
import type { NestedMap } from './LEGACY/find-repeated-structures.ts';
import { getSharedStructName } from './find-patterns.ts';

function sortEntries<T>(entries: Array<[string, T]>): Array<[string, T]> {
  return [...entries].sort(([a], [b]) => a.localeCompare(b));
}

function resolveType(value: NestedMap | string, patterns: Map<string, string[]>): string {
  if (typeof value === 'string') return value;
  return getSharedStructName(value, patterns) ?? 'Unknown';
}

export function buildVariablesForNode(
  node: NestedMap,
  patterns: Map<string, string[]>,
): SwiftVariable[] {
  const variables: SwiftVariable[] = [];
  const stringEntries = sortEntries(Object.entries(node).filter(([, v]) => typeof v === 'string'));
  const objectEntries = sortEntries(Object.entries(node).filter(([, v]) => typeof v !== 'string'));

  for (const [key, value] of stringEntries) {
    variables.push({ name: toSwiftVariableName([key]), type: value as string });
  }

  for (const [key, value] of objectEntries) {
    const sharedName = getSharedStructName(value as NestedMap, patterns);
    variables.push({
      name: toSwiftVariableName([key]),
      type: sharedName ?? resolveType(value, patterns),
    });
  }

  return variables;
}
