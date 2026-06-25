import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import type { SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';

function sortEntries<T>(entries: Array<[string, T]>): Array<[string, T]> {
  return [...entries].sort(([a], [b]) => a.localeCompare(b));
}

export function buildSwiftVariablesForNode(node: SwiftNestedMap): SwiftVariable[] {
  const allEntries = Object.entries(node);

  const stringVars = sortEntries(allEntries.filter(([, v]) => typeof v === 'string')).map(
    ([key, value]) => ({
      name: toSwiftVariableName([key]),
      type: value as string,
    }),
  );

  const objectVars = sortEntries(allEntries.filter(([, v]) => typeof v !== 'string')).map(
    ([key]) => ({
      name: toSwiftVariableName([key]),
      type: 'Unknown',
    }),
  );

  return [...stringVars, ...objectVars];
}
