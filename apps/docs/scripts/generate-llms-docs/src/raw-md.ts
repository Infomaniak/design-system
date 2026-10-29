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
const FENCE_OPEN_PATTERN: RegExp = /^[ \t]{0,3}(`{3,}|~{3,})/;

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
  let content = stripImportsAndMeta(mdxSource);
  for (const [identifier, markdown] of resolved) {
    content = content.replace(docsMarkdownPattern(identifier), () => markdown);
  }
  return content
    .replace(WHITESPACE_ONLY_LINE_PATTERN, '')
    .replace(EXCESS_NEWLINES_PATTERN, '\n\n')
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILING_BLANK_LINES_PATTERN, '');
}

/**
 * Removes MDX-only syntax (import statements and `<Meta/>` tags) while leaving
 * fenced code blocks untouched: import statements inside fences are sample
 * code, not MDX imports.
 */
export function stripImportsAndMeta(mdxSource: string): string {
  return transformOutsideFences(mdxSource, (text) =>
    text
      .replace(NAMED_IMPORT_PATTERN, '')
      .replace(BARE_IMPORT_PATTERN, '')
      .replace(META_TAG_PATTERN, ''),
  );
}

/**
 * Applies a transform to the text outside fenced code blocks and returns the
 * fences untouched. The transform receives contiguous runs of non-fence text
 * (without the surrounding newlines) and must behave like an idempotent
 * substitution.
 */
export function transformOutsideFences(
  source: string,
  transform: (text: string) => string,
): string {
  const lines = source.split('\n');
  const output: string[] = [];
  let proseChunk: string[] = [];
  let inFence = false;
  let fenceChar = '';
  let fenceLength = 0;

  const flushProseChunk = (): void => {
    if (proseChunk.length === 0) {
      return;
    }
    output.push(transform(proseChunk.join('\n')));
    proseChunk = [];
  };

  for (const line of lines) {
    if (inFence) {
      if (isClosingFence(line, fenceChar, fenceLength)) {
        inFence = false;
      }
      output.push(line);
      continue;
    }
    const opening = FENCE_OPEN_PATTERN.exec(line);
    if (opening !== null) {
      flushProseChunk();
      inFence = true;
      fenceChar = opening[1]![0]!;
      fenceLength = opening[1]!.length;
      output.push(line);
      continue;
    }
    proseChunk.push(line);
  }
  flushProseChunk();
  return output.join('\n');
}

function isClosingFence(line: string, fenceChar: string, fenceLength: number): boolean {
  return new RegExp(`^[ \\\\t]{0,3}[${fenceChar}]{${fenceLength},}[ \\\\t]*$`).test(line);
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
