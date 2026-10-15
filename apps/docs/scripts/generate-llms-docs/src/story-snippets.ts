import type { StorySnippet } from './types.ts';

export type ArgsRecord = Record<string, unknown>;

export interface ParsedStory {
  exportName: string;
  jsdoc: string | null;
  args: ArgsRecord | null;
  interactiveArgs: ArgsRecord | null;
  renderTemplate: string | null;
}

export interface ParsedMeta {
  args: ArgsRecord | null;
  interactiveArgs: ArgsRecord | null;
  renderTemplate: string | null;
  componentTag: string | null;
}

export interface ParsedStoriesFile {
  meta: ParsedMeta;
  stories: ParsedStory[];
}

interface ParsedValue {
  value: string | number | boolean;
  end: number;
}

const META_DECLARATION_PATTERN = /const\s+[A-Za-z_$][\w$]*\s*=\s*\{/;
const DEFAULT_EXPORT_PATTERN = /export\s+default\s*\{/;
const META_TYPE_SUFFIX_PATTERN = /^\s*(?:satisfies|as)\s+Meta\b/;
const STORY_EXPORT_PATTERN = /export\s+const\s+([A-Za-z_$][\w$]*)/g;
const ASSIGNMENT_PATTERN = /=\s*\{/;
const RENDER_PATTERN = /render\s*:\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*html`/;
const ARGS_PROPERTY_PATTERN = /\bargs\s*:/;
const QUOTED_ATTRIBUTE_PATTERN = /(?:^|[\s(])[?:]?[A-Za-z_$][\w$-]*="$/;
const UNQUOTED_ATTRIBUTE_PATTERN = /(?:^|[\s(])[?:]?[A-Za-z_$][\w$-]*=[ \t]*$/;
const DIRECTIVE_PREFIX_PATTERN = /^(?:ifDefined|template)\s*\(/;
const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/;
const IDENTIFIER_CALL_PATTERN = /^[A-Za-z_$][\w$]*\s*\(/;
const ARGS_MEMBER_PATTERN = /^args\.([A-Za-z_$][\w$]*)$/;
const IF_DEFINED_PATTERN = /^ifDefined\(args\.([A-Za-z_$][\w$]*)\)$/;
const TEMPLATE_CALL_PATTERN = /^template\s*\(\s*args\s*\)$/;
const KEY_PATTERN = /^(?:([A-Za-z_$][\w$]*)|'([^']*)')/;
const NUMBER_PATTERN = /^-?\d+(?:\.\d+)?/;

function skipWhitespace(source: string, index: number): number {
  let i = index;
  while (i < source.length && /\s/.test(source[i])) i++;
  return i;
}

function skipWhitespaceAndCommas(source: string, index: number): number {
  let i = index;
  while (i < source.length && /[\s,]/.test(source[i])) i++;
  return i;
}

function scanStringLiteral(source: string, start: number): number {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i++;
  }
  return -1;
}

function scanTemplateLiteral(source: string, start: number): number {
  let i = start + 1;
  while (i < source.length) {
    const char = source[i];
    if (char === '\\') {
      i += 2;
      continue;
    }
    if (char === '`') return i + 1;
    if (char === '$' && source[i + 1] === '{') {
      i = scanTemplateExpression(source, i + 2);
      if (i < 0) return -1;
      continue;
    }
    i++;
  }
  return -1;
}

function scanTemplateExpression(source: string, start: number): number {
  let depth = 1;
  let i = start;
  while (i < source.length) {
    const char = source[i];
    if (char === '{') {
      depth++;
      i++;
      continue;
    }
    if (char === '}') {
      depth--;
      if (depth === 0) return i + 1;
      i++;
      continue;
    }
    if (char === "'" || char === '"') {
      i = scanStringLiteral(source, i);
      if (i < 0) return -1;
      continue;
    }
    if (char === '`') {
      i = scanTemplateLiteral(source, i);
      if (i < 0) return -1;
      continue;
    }
    i++;
  }
  return -1;
}

function scanBracedLiteral(source: string, openIndex: number): number {
  let depth = 0;
  let i = openIndex;
  while (i < source.length) {
    const char = source[i];
    if (char === '{') {
      depth++;
      i++;
      continue;
    }
    if (char === '}') {
      depth--;
      if (depth === 0) return i + 1;
      i++;
      continue;
    }
    if (char === "'" || char === '"') {
      i = scanStringLiteral(source, i);
      if (i < 0) return -1;
      continue;
    }
    if (char === '`') {
      i = scanTemplateLiteral(source, i);
      if (i < 0) return -1;
      continue;
    }
    i++;
  }
  return -1;
}

function scanParenthesized(source: string, openIndex: number): number {
  let depth = 0;
  let inTemplate = false;
  let templateExpressionDepth = 0;
  let quote: string | null = null;
  for (let i = openIndex; i < source.length; i++) {
    const char = source[i];
    if (quote !== null) {
      if (char === '\\') i++;
      else if (char === quote) quote = null;
      continue;
    }
    if (inTemplate) {
      if (char === '\\') i++;
      else if (char === '$' && source[i + 1] === '{') {
        inTemplate = false;
        templateExpressionDepth = 1;
        i++;
      } else if (char === '`') inTemplate = false;
      continue;
    }
    if (templateExpressionDepth > 0) {
      if (char === '{') templateExpressionDepth++;
      else if (char === '}') {
        templateExpressionDepth--;
        if (templateExpressionDepth === 0) inTemplate = true;
      } else if (char === "'" || char === '"') quote = char;
      else if (char === '`') inTemplate = true;
      continue;
    }
    if (char === '(') {
      depth++;
      continue;
    }
    if (char === ')') {
      depth--;
      if (depth === 0) return i + 1;
      continue;
    }
    if (char === "'" || char === '"') quote = char;
    else if (char === '`') inTemplate = true;
  }
  return -1;
}

function findTopLevelComma(source: string, start: number): number {
  let depth = 0;
  let inTemplate = false;
  let templateExpressionDepth = 0;
  let quote: string | null = null;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (quote !== null) {
      if (char === '\\') i++;
      else if (char === quote) quote = null;
      continue;
    }
    if (inTemplate) {
      if (char === '\\') i++;
      else if (char === '$' && source[i + 1] === '{') {
        inTemplate = false;
        templateExpressionDepth = 1;
        i++;
      } else if (char === '`') inTemplate = false;
      continue;
    }
    if (templateExpressionDepth > 0) {
      if (char === '{') templateExpressionDepth++;
      else if (char === '}') {
        templateExpressionDepth--;
        if (templateExpressionDepth === 0) inTemplate = true;
      } else if (char === "'" || char === '"') quote = char;
      else if (char === '`') inTemplate = true;
      continue;
    }
    if (char === ',' && depth === 0) return i;
    if (char === '{' || char === '(' || char === '[') depth++;
    else if (char === '}' || char === ')' || char === ']') depth--;
    else if (char === "'" || char === '"') quote = char;
    else if (char === '`') inTemplate = true;
  }
  return -1;
}

function skipValueExpression(source: string, index: number): number {
  const commaIndex = findTopLevelComma(source, index);
  if (commaIndex < 0) return source.length;
  return commaIndex + 1;
}

function unescapeStringLiteral(value: string): string {
  return value.replace(/\\(.)/g, (_match, char: string) => {
    if (char === 'n') return '\n';
    if (char === 't') return '\t';
    return char;
  });
}

export function parseValueLiteral(source: string, index: number): ParsedValue | null {
  const char = source[index];
  if (char === "'" || char === '"') {
    const end = scanStringLiteral(source, index);
    if (end < 0) return null;
    return { value: unescapeStringLiteral(source.slice(index + 1, end - 1)), end };
  }
  if (char === '-' || /\d/.test(char)) {
    const match = NUMBER_PATTERN.exec(source.slice(index));
    if (match === null) return null;
    return { value: Number(match[0]), end: index + match[0].length };
  }
  if (source.startsWith('true', index)) return { value: true, end: index + 4 };
  if (source.startsWith('false', index)) return { value: false, end: index + 5 };
  if (char === '{') {
    const end = scanBracedLiteral(source, index);
    if (end < 0) return null;
    const inner = source.slice(index + 1, end - 1);
    const valueProperty = /\bvalue\s*:/.exec(inner);
    if (valueProperty === null) return null;
    const valueStart = skipWhitespace(inner, valueProperty.index + valueProperty[0].length);
    const parsed = parseValueLiteral(inner, valueStart);
    if (parsed === null) return null;
    return { value: parsed.value, end };
  }
  return null;
}

function parseArgsLiteral(body: string): ArgsRecord {
  const record: ArgsRecord = {};
  let i = 0;
  while (i < body.length) {
    i = skipWhitespaceAndCommas(body, i);
    if (i >= body.length) break;
    if (body.startsWith('...', i)) {
      i = skipValueExpression(body, i);
      continue;
    }
    const keyMatch = KEY_PATTERN.exec(body.slice(i));
    if (keyMatch === null) {
      i = skipValueExpression(body, i);
      continue;
    }
    const key = keyMatch[1] ?? keyMatch[2];
    i = skipWhitespace(body, i + keyMatch[0].length);
    if (body[i] !== ':') {
      i = skipValueExpression(body, i);
      continue;
    }
    i = skipWhitespace(body, i + 1);
    const parsed = parseValueLiteral(body, i);
    if (parsed === null) {
      i = skipValueExpression(body, i);
      continue;
    }
    record[key] = parsed.value;
    i = parsed.end;
  }
  return record;
}

export function parsePropertyArgs(body: string): ArgsRecord | null {
  const match = ARGS_PROPERTY_PATTERN.exec(body);
  if (match === null) return null;
  const valueStart = skipWhitespace(body, match.index + match[0].length);
  if (body[valueStart] !== '{') return null;
  const end = scanBracedLiteral(body, valueStart);
  if (end < 0) return null;
  return parseArgsLiteral(body.slice(valueStart + 1, end - 1));
}

function extractInteractiveArgs(body: string): ArgsRecord | null {
  const marker = 'storybookInteractiveControls(';
  const markerIndex = body.indexOf(marker);
  if (markerIndex < 0) return null;
  const openParen = markerIndex + marker.length - 1;
  const closeParen = scanParenthesized(body, openParen);
  if (closeParen < 0) return null;
  const callBody = body.slice(openParen + 1, closeParen - 1);
  const openBrace = callBody.indexOf('{');
  if (openBrace < 0) return null;
  const braceEnd = scanBracedLiteral(callBody, openBrace);
  if (braceEnd < 0) return null;
  return parseArgsLiteral(callBody.slice(openBrace + 1, braceEnd - 1));
}

export function extractRenderTemplate(body: string): string | null {
  const match = RENDER_PATTERN.exec(body);
  if (match === null) return null;
  const backtick = match.index + match[0].length - 1;
  const end = scanTemplateLiteral(body, backtick);
  if (end < 0) return null;
  return body.slice(backtick + 1, end - 1);
}

function matchQuotedProperty(body: string, property: string): string | null {
  const pattern = new RegExp(`\\b${property}\\s*:\\s*'([^']+)'`);
  return pattern.exec(body)?.[1] ?? null;
}

function findMetaBody(source: string): string | null {
  const candidates: { index: number; isDefaultExport: boolean }[] = [];
  const declarations = new RegExp(META_DECLARATION_PATTERN.source, 'g');
  let declarationMatch = declarations.exec(source);
  while (declarationMatch !== null) {
    candidates.push({ index: declarationMatch.index, isDefaultExport: false });
    declarationMatch = declarations.exec(source);
  }
  const defaultExports = new RegExp(DEFAULT_EXPORT_PATTERN.source, 'g');
  let defaultMatch = defaultExports.exec(source);
  while (defaultMatch !== null) {
    candidates.push({ index: defaultMatch.index, isDefaultExport: true });
    defaultMatch = defaultExports.exec(source);
  }
  candidates.sort((first, second) => first.index - second.index);
  for (const candidate of candidates) {
    const openBrace = source.indexOf('{', candidate.index);
    const end = scanBracedLiteral(source, openBrace);
    if (end < 0) continue;
    if (!candidate.isDefaultExport && !META_TYPE_SUFFIX_PATTERN.test(source.slice(end, end + 64))) {
      continue;
    }
    return source.slice(openBrace + 1, end - 1);
  }
  return null;
}

function extractBlockCommentBefore(source: string, index: number): string | null {
  let end = index;
  while (end > 0 && /\s/.test(source[end - 1])) end--;
  if (!source.slice(0, end).endsWith('*/')) return null;
  const commentEnd = end - 2;
  const commentStart = source.lastIndexOf('/**', commentEnd);
  if (commentStart < 0) return null;
  const text = source
    .slice(commentStart + 3, commentEnd)
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
  return text === '' ? null : text;
}

function extractStoryBody(source: string, indexAfterExportName: number): string | null {
  const rest = source.slice(indexAfterExportName);
  const assignment = ASSIGNMENT_PATTERN.exec(rest);
  if (assignment === null) return null;
  const openBrace = indexAfterExportName + assignment.index + assignment[0].length - 1;
  const end = scanBracedLiteral(source, openBrace);
  if (end < 0) return null;
  return source.slice(openBrace + 1, end - 1);
}

export function parseStoriesFile(source: string): ParsedStoriesFile {
  const metaBody = findMetaBody(source);
  const meta: ParsedMeta = {
    componentTag: metaBody === null ? null : matchQuotedProperty(metaBody, 'component'),
    args: metaBody === null ? null : parsePropertyArgs(metaBody),
    interactiveArgs: metaBody === null ? null : extractInteractiveArgs(metaBody),
    renderTemplate: metaBody === null ? null : extractRenderTemplate(metaBody),
  };
  const stories: ParsedStory[] = [];
  const storyExports = new RegExp(STORY_EXPORT_PATTERN.source, 'g');
  let storyMatch = storyExports.exec(source);
  while (storyMatch !== null) {
    const body = extractStoryBody(source, storyMatch.index + storyMatch[0].length);
    if (body !== null) {
      stories.push({
        exportName: storyMatch[1],
        jsdoc: extractBlockCommentBefore(source, storyMatch.index),
        args: parsePropertyArgs(body),
        interactiveArgs: extractInteractiveArgs(body),
        renderTemplate: extractRenderTemplate(body),
      });
    }
    storyMatch = storyExports.exec(source);
  }
  return { meta, stories };
}

export function mergeArgs(...sources: (ArgsRecord | null | undefined)[]): ArgsRecord {
  const merged: ArgsRecord = {};
  for (const source of sources) {
    if (source === null || source === undefined) continue;
    Object.assign(merged, source);
  }
  return merged;
}

function escapeAttributeValue(value: string): string {
  return value.replaceAll('"', '&quot;');
}

export function synthesizeTagSnippet(tagName: string, args: ArgsRecord): string {
  const attributes: string[] = [];
  for (const [key, value] of Object.entries(args)) {
    if (value === true) {
      attributes.push(key);
    } else if (typeof value === 'number') {
      attributes.push(`${key}="${String(value)}"`);
    } else if (typeof value === 'string' && value !== '') {
      attributes.push(`${key}="${escapeAttributeValue(value)}"`);
    }
  }
  const openTag = attributes.length === 0 ? `<${tagName}>` : `<${tagName} ${attributes.join(' ')}>`;
  return `${openTag}</${tagName}>`;
}

function isDirective(expression: string): boolean {
  if (DIRECTIVE_PREFIX_PATTERN.test(expression)) return false;
  if (IDENTIFIER_PATTERN.test(expression)) return true;
  return IDENTIFIER_CALL_PATTERN.test(expression);
}

function resolveExpression(
  expression: string,
  args: ArgsRecord,
  componentTag: string | null,
): string | null {
  const argsMember = ARGS_MEMBER_PATTERN.exec(expression);
  if (argsMember !== null) {
    const key = argsMember[1];
    if (!Object.hasOwn(args, key)) return null;
    const value = args[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return null;
  }
  const ifDefined = IF_DEFINED_PATTERN.exec(expression);
  if (ifDefined !== null) {
    const value = args[ifDefined[1]];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  }
  if (TEMPLATE_CALL_PATTERN.test(expression)) {
    return componentTag === null ? null : synthesizeTagSnippet(componentTag, args);
  }
  return null;
}

function replaceExpressions(
  template: string,
  args: ArgsRecord,
  componentTag: string | null,
): string | null {
  let output = '';
  let i = 0;
  while (i < template.length) {
    const char = template[i];
    if (char === '`') return null;
    if (char === '$' && template[i + 1] === '{') {
      const expressionEnd = scanTemplateExpression(template, i + 2);
      if (expressionEnd < 0) return null;
      const expression = template.slice(i + 2, expressionEnd - 1).trim();
      if (isDirective(expression)) {
        output = output.replace(/[ \t\n]+$/, '');
        i = expressionEnd;
        continue;
      }
      const resolved = resolveExpression(expression, args, componentTag);
      if (resolved === null) return null;
      const quotedAttribute = QUOTED_ATTRIBUTE_PATTERN.exec(output);
      const unquotedAttribute = UNQUOTED_ATTRIBUTE_PATTERN.exec(output);
      if (quotedAttribute !== null) {
        output += resolved;
      } else if (unquotedAttribute !== null) {
        if (resolved === '') {
          output = output.slice(0, output.length - unquotedAttribute[0].length);
        } else {
          output += `"${resolved}"`;
        }
      } else {
        output += resolved;
      }
      i = expressionEnd;
      continue;
    }
    output += char;
    i++;
  }
  return output;
}

export function cleanRenderTemplate(
  template: string,
  args: ArgsRecord,
  componentTag: string | null = null,
): string | null {
  const withoutComments = template.replace(/<!--[\s\S]*?-->/g, '');
  const replaced = replaceExpressions(withoutComments, args, componentTag);
  if (replaced === null) return null;
  const withoutBlankLines = replaced
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
  const trimmed = withoutBlankLines.trim();
  return trimmed === '' ? null : trimmed;
}

export function humanizeExportName(exportName: string): string {
  return exportName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

export function buildStorySnippets(input: {
  tagName: string;
  cemDefaults: ArgsRecord;
  meta: ParsedMeta;
  stories: ParsedStory[];
}): StorySnippet[] {
  const snippets: StorySnippet[] = [];
  for (const story of input.stories) {
    const merged = mergeArgs(
      input.cemDefaults,
      input.meta.args,
      input.meta.interactiveArgs,
      story.args,
      story.interactiveArgs,
    );
    const explicit = mergeArgs(
      input.meta.args,
      input.meta.interactiveArgs,
      story.args,
      story.interactiveArgs,
    );
    const template = story.renderTemplate ?? input.meta.renderTemplate;
    const cleaned = template === null ? null : cleanRenderTemplate(template, merged, input.tagName);
    snippets.push({
      name: humanizeExportName(story.exportName),
      description: story.jsdoc ?? undefined,
      code: cleaned ?? synthesizeTagSnippet(input.tagName, explicit),
    });
  }
  return snippets;
}
