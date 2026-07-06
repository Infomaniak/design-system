import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import { buildSwiftFile } from '../../helpers/build-swift-file.ts';
import {
  SWIFT_FOUNDATION_DIR,
  SWIFT_MAIN_STRUCT,
  SWIFT_PRIMITIVE_TARGET_NAME,
} from '../../swift-constants.ts';
import type { ValueMapDifference } from './find-value-map-differences.ts';

interface FlatDifference {
  readonly name: string;
  readonly value: string;
}

export function buildSwiftThemeExtension(
  modifierName: string,
  differences: readonly ValueMapDifference[],
): string {
  const differencesByType = new Map<string, FlatDifference[]>();

  for (const diff of differences) {
    const [typeKey, ...rest] = JSON.parse(diff.key) as string[];
    const entries = differencesByType.get(typeKey) ?? [];
    entries.push({ name: toSwiftVariableName(rest), value: diff.value });
    differencesByType.set(typeKey, entries);
  }

  const typeArgs = Array.from(differencesByType.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([typeKey, entries]) => {
      const typeName = toPascalCase(typeKey);
      const varName = toSwiftVariableName([typeKey]);
      const fieldArgs = entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) => `${entry.name}: ${entry.value}`)
        .join(',\n');

      return `${varName}: ${typeName}(\n${fieldArgs}\n)`;
    })
    .join(',\n');

  const initCall = `${SWIFT_MAIN_STRUCT}(\n${typeArgs}\n)`;

  return buildSwiftFile({
    imports: ['SwiftUI', SWIFT_FOUNDATION_DIR, SWIFT_PRIMITIVE_TARGET_NAME],
    type: 'public extension',
    name: `${SWIFT_MAIN_STRUCT}`,
    protocols: [],
    content: `static let ${modifierName} = ${initCall}`,
  });
}
