import { toCamelCase } from '../../../../../../../../../../scripts/helpers/misc/case/to-camel-case/to-camel-case.ts';

const SWIFT_RESERVED = new Set(['default', 'in', 'for', 'while', 'return', 'case', 'switch']);

export function toSwiftVariableName(parts: string[]): string {
  const name = toCamelCase(
    parts.filter((segment: string): boolean => segment !== '$root').join('-'),
  );
  if (SWIFT_RESERVED.has(name)) return `\`${name}\``;
  return name;
}
