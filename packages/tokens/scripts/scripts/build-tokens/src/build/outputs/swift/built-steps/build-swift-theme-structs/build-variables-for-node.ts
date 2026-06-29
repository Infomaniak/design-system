import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import type { SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';

export function getSortedSwiftVariables(
  node: SwiftNestedMap,
  valueMap: Map<string, string>,
  path: string[],
): SwiftVariable[] {
  const allEntries = Object.entries(node);

  const variables: SwiftVariable[] = [];

  for (const [key, value] of allEntries) {
    const fullPath = [...path, key];

    if (typeof value === 'string') {
      variables.push({
        name: toSwiftVariableName([key]),
        type: value,
        initValue: valueMap.get(JSON.stringify(fullPath)),
      });
    } else {
      variables.push({
        name: toSwiftVariableName([key]),
        type: 'Unknown',
        initValue: undefined,
      });
    }
  }

  return variables.sort((a, b) => a.name.localeCompare(b.name));
}
