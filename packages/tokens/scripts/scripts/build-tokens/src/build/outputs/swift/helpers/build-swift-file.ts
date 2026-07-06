import { AUTO_GENERATED_FILE_HEADER } from '../../../constants/auto-generated-file-header.ts';

export interface BuildSwiftFileOption {
  readonly imports: readonly string[];
  readonly type: string;
  readonly name: string;
  readonly protocols: readonly string[];
  readonly content: string;
}

export const SWIFT_INDENT = '    ';

export function indentSwiftLines(text: string, indent: string = SWIFT_INDENT): string {
  return text
    .split('\n')
    .map((line: string): string => (line.length === 0 ? line : `${indent}${line}`))
    .join('\n');
}

export function buildSwiftFile({
  imports,
  type,
  name,
  protocols,
  content,
}: BuildSwiftFileOption): string {
  const safeProtocols = protocols.length ? `: ${protocols.join(', ')}` : '';
  const safeContent = content.length ? `{\n${indentSwiftLines(content)}\n}` : `{}`;
  const importsBlock = imports
    .map((importName: string): string => `import ${importName}`)
    .join('\n');

  return `/*\n${SWIFT_INDENT}${AUTO_GENERATED_FILE_HEADER}\n*/\n\n${importsBlock}\n\n${type} ${name}${safeProtocols} ${safeContent}`;
}
