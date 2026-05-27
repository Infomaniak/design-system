import type { SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import { toSwiftVariableName } from '../../swift-naming-helper.ts';
import type { NestedMap } from './build-token-tree.ts';

function sortEntries<T>(entries: Array<[string, T]>): Array<[string, T]> {
  return [...entries].sort(([a], [b]) => a.localeCompare(b));
}

export function buildSwiftVariablesForNode(node: NestedMap): SwiftVariable[] {
  const variables: SwiftVariable[] = [];
  const stringEntries = sortEntries(Object.entries(node).filter(([, v]) => typeof v === 'string'));
  const objectEntries = sortEntries(Object.entries(node).filter(([, v]) => typeof v !== 'string'));

  for (const [key, value] of stringEntries) {
    variables.push({ name: toSwiftVariableName([key]), type: value as string });
  }

  for (const [key, value] of objectEntries) {
    variables.push({
      name: toSwiftVariableName([key]),
      type: typeof value === 'string' ? value : 'Unknown',
    });
  }

  return variables;
}
