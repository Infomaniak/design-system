const RAW_MD_IMPORT_PATTERN: RegExp =
  /^[ \t]*import\s+([A-Za-z_$][A-Za-z0-9_$]*)\s+from\s+'([^']+\.md)\?raw'\s*;?[ \t]*$/gm;
const NAMED_IMPORT_PATTERN: RegExp = /^[ \t]*import\s[^'\n]+?\sfrom\s+'[^']*'\s*;?[ \t]*$/gm;
const BARE_IMPORT_PATTERN: RegExp = /^[ \t]*import\s+'[^']*'\s*;?[ \t]*$/gm;
const META_TAG_PATTERN: RegExp = /<Meta\b[^>]*\/>/g;
const WHITESPACE_ONLY_LINE_PATTERN: RegExp = /^[ \t]+$/gm;
const EXCESS_NEWLINES_PATTERN: RegExp = /\n{3,}/g;
const LEADING_BLANK_LINES_PATTERN: RegExp = /^\n+/;
const TRAILING_BLANK_LINES_PATTERN: RegExp = /\n+$/;
const REGEX_SPECIAL_CHARS_PATTERN: RegExp = /[.*+?^${}()|[\]\\]/g;

export interface RawMdImport {
  identifier: string;
  importPath: string;
}

export function extractRawMdImports(mdxSource: string): RawMdImport[] {
  const rawImports: RawMdImport[] = [];
  for (const match of mdxSource.matchAll(RAW_MD_IMPORT_PATTERN)) {
    rawImports.push({ identifier: match[1], importPath: match[2] });
  }
  return rawImports;
}

export function cleanMdxContent(mdxSource: string, resolved: Map<string, string>): string {
  let content = mdxSource
    .replace(NAMED_IMPORT_PATTERN, '')
    .replace(BARE_IMPORT_PATTERN, '')
    .replace(META_TAG_PATTERN, '');
  for (const [identifier, markdown] of resolved) {
    content = content.replace(docsMarkdownPattern(identifier), () => markdown);
  }
  return content
    .replace(WHITESPACE_ONLY_LINE_PATTERN, '')
    .replace(EXCESS_NEWLINES_PATTERN, '\n\n')
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILING_BLANK_LINES_PATTERN, '');
}

function docsMarkdownPattern(identifier: string): RegExp {
  return new RegExp(
    `<DocsMarkdown>\\s*\\{\\s*${escapeRegExp(identifier)}\\s*\\}\\s*</DocsMarkdown>`,
    'g',
  );
}

function escapeRegExp(value: string): string {
  return value.replace(REGEX_SPECIAL_CHARS_PATTERN, '\\$&');
}
