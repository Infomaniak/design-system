import type { CemComponentKind, CemElementDocs, StorySnippet } from './types.ts';

export type ArgsRecord = Record<string, unknown>;

/** Rendering context of a component: a real element or a custom attribute. */
export interface SnippetContext {
  kind: CemComponentKind;
  /** CEM tag name (doubles as the attribute name for `attribute` kind). */
  tagName: string;
  /** The attribute name for `attribute` kind (equals `tagName`). */
  attributeName: string;
  /** CEM-declared attribute names of the component. */
  attributeNames: ReadonlySet<string>;
  /** CEM-declared slot names (empty string for the default slot). */
  slotNames: ReadonlySet<string>;
}

/** Builds the snippet rendering context from the CEM docs of a component. */
export function toSnippetContext(cemDocs: CemElementDocs): SnippetContext {
  return {
    kind: cemDocs.kind,
    tagName: cemDocs.tagName,
    attributeName: cemDocs.attributeName,
    attributeNames: new Set(cemDocs.attributes.map((attribute) => attribute.name)),
    slotNames: new Set(cemDocs.slots.map((slot) => slot.name)),
  };
}

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
const QUOTED_ATTRIBUTE_TAIL_PATTERN = /(?:^|[\s(])[ \t]*([?:@]?)([A-Za-z_$][\w$-]*)="$/;
const UNQUOTED_ATTRIBUTE_TAIL_PATTERN = /(?:^|[\s(])[ \t]*([?:@]?)([A-Za-z_$][\w$-]*)=[ \t]*$/;
const EVENT_ATTRIBUTE_TAIL_PATTERN =
  /(?:^|[\s(])[ \t]*@[A-Za-z_$][\w$.-]*(?:[ \t]*=(?:[ \t]*(?:"|'))?)$/;
const DIRECTIVE_PREFIX_PATTERN = /^(?:ifDefined|template)\s*\(/;
const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/;
const IDENTIFIER_CALL_PATTERN = /^[A-Za-z_$][\w$]*(?:\.[\w$]+)*\s*\(/;
const ARGS_MEMBER_PATTERN = /^args\.([A-Za-z_$][\w$]*)$/;
const ARGS_BRACKET_MEMBER_PATTERN = /^args\[(?:'([^']*)'|"([^"]*)")\]$/;
const IF_DEFINED_PATTERN = /^ifDefined\(args\.([A-Za-z_$][\w$]*)\)$/;
const IF_DEFINED_BRACKET_PATTERN = /^ifDefined\(args\[(?:'([^']*)'|"([^"]*)")\]\)$/;
const TEMPLATE_CALL_PATTERN = /^template\s*\(\s*args\s*\)$/;
const OPEN_TAG_PATTERN = /<([a-zA-Z][\w-]*)([^>]*)>/g;
const TAG_ATTRIBUTE_PATTERN = /([A-Za-z][\w-]*)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
const SPLIT_CLOSING_TAG_PATTERN = /<\/([A-Za-z][\w-]*)[ \t]*\n[ \t]*>/g;
const SPLIT_OPEN_TAG_GT_PATTERN = /\n[ \t]*>(?=\S)/g;
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

function parseValueLiteral(source: string, index: number): ParsedValue | null {
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

function parsePropertyArgs(body: string): ArgsRecord | null {
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

function extractRenderTemplate(body: string): string | null {
  const match = RENDER_PATTERN.exec(body);
  if (match === null) return null;
  const backtick = match.index + match[0].length - 1;
  const end = scanTemplateLiteral(body, backtick);
  if (end < 0) return null;
  return body.slice(backtick + 1, end - 1);
}

function matchQuotedProperty(body: string, property: string): string | null {
  const pattern = new RegExp(`\\b${property}\\s*:\\s*['"]([^'"]+)['"]`);
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Extracts the args member of `args.key` / `args['key']` / `args["key"]`. */
function matchArgsMember(expression: string): string | null {
  const dotMember = ARGS_MEMBER_PATTERN.exec(expression);
  if (dotMember !== null) return dotMember[1];
  const bracketMember = ARGS_BRACKET_MEMBER_PATTERN.exec(expression);
  if (bracketMember !== null) return bracketMember[1] ?? bracketMember[2];
  return null;
}

/** Extracts the args member of `ifDefined(args.key)` / `ifDefined(args['key'])`. */
function matchIfDefinedArgsMember(expression: string): string | null {
  const dotMember = IF_DEFINED_PATTERN.exec(expression);
  if (dotMember !== null) return dotMember[1];
  const bracketMember = IF_DEFINED_BRACKET_PATTERN.exec(expression);
  if (bracketMember !== null) return bracketMember[1] ?? bracketMember[2];
  return null;
}

type ExpressionResolution =
  | { status: 'value'; value: string }
  /** `ifDefined` with a missing value: the whole attribute is dropped. */
  | { status: 'empty' }
  /** Boolean args member (boolean attribute binding). */
  | { status: 'boolean'; value: boolean }
  /** Args member absent from the merged args (e.g. spread-provided controls). */
  | { status: 'missing' }
  | { status: 'unresolvable' };

function resolveExpression(
  expression: string,
  args: ArgsRecord,
  context: SnippetContext | null,
): ExpressionResolution {
  const memberKey = matchArgsMember(expression);
  if (memberKey !== null) {
    if (!Object.hasOwn(args, memberKey)) return { status: 'missing' };
    const value = args[memberKey];
    if (typeof value === 'string') return { status: 'value', value };
    if (typeof value === 'number') return { status: 'value', value: String(value) };
    if (typeof value === 'boolean') return { status: 'boolean', value };
    return { status: 'unresolvable' };
  }
  const ifDefinedKey = matchIfDefinedArgsMember(expression);
  if (ifDefinedKey !== null) {
    const value = args[ifDefinedKey];
    if (typeof value === 'string') return { status: 'value', value };
    if (typeof value === 'number') return { status: 'value', value: String(value) };
    return { status: 'empty' };
  }
  if (TEMPLATE_CALL_PATTERN.test(expression)) {
    if (context === null) return { status: 'unresolvable' };
    const snippet = synthesizeSnippet(context, args, null);
    return snippet === null ? { status: 'unresolvable' } : { status: 'value', value: snippet };
  }
  return { status: 'unresolvable' };
}

/**
 * Maps a slot-ish arg key to the slot name it fills: `default-slot` targets the
 * default slot (empty name) and `<name>-slot` the named slot `<name>`.
 */
function matchSlotArgKey(key: string, context: SnippetContext): string | null {
  if (key === 'default-slot') return '';
  if (key.endsWith('-slot') && context.slotNames.has(key.slice(0, -5))) return key.slice(0, -5);
  return null;
}

function toChildContent(value: ArgsRecord[string]): string | null {
  if (typeof value === 'string' && value !== '') return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function synthesizeElementSnippet(context: SnippetContext, args: ArgsRecord): string {
  const attributes: string[] = [];
  let childContent: string | null = null;
  for (const [key, value] of Object.entries(args)) {
    if (matchSlotArgKey(key, context) !== null) {
      childContent = toChildContent(value) ?? childContent;
      continue;
    }
    if (!context.attributeNames.has(key)) continue;
    if (value === true) {
      attributes.push(key);
    } else if (typeof value === 'number') {
      attributes.push(`${key}="${String(value)}"`);
    } else if (typeof value === 'string' && value !== '') {
      attributes.push(`${key}="${escapeAttributeValue(value)}"`);
    }
  }
  const openTag =
    attributes.length === 0
      ? `<${context.tagName}>`
      : `<${context.tagName} ${attributes.join(' ')}>`;
  const content = childContent === null ? '' : childContent;
  return `${openTag}${content}</${context.tagName}>`;
}

/**
 * Finds the first open tag in the template text (nested template literals
 * included) whose attribute list carries the custom attribute name.
 */
export function findAttributeHostTag(template: string, attributeName: string): string | null {
  for (const match of template.matchAll(OPEN_TAG_PATTERN)) {
    if (tagAttributesInclude(match[2], attributeName)) return match[1];
  }
  return null;
}

function tagAttributesInclude(segment: string, attributeName: string): boolean {
  for (const match of segment.matchAll(TAG_ATTRIBUTE_PATTERN)) {
    if (match[1] === attributeName) return true;
  }
  return false;
}

function synthesizeAttributeSnippet(
  context: SnippetContext,
  args: ArgsRecord,
  template: string | null,
): string | null {
  const hostTag = template === null ? null : findAttributeHostTag(template, context.attributeName);
  if (hostTag === null) return null;
  const attributes = [context.attributeName];
  for (const [key, value] of Object.entries(args)) {
    if (!context.attributeNames.has(key)) continue;
    if (value === true) {
      attributes.push(key);
    } else if (typeof value === 'number') {
      attributes.push(`${key}="${String(value)}"`);
    } else if (typeof value === 'string' && value !== '') {
      attributes.push(`${key}="${escapeAttributeValue(value)}"`);
    }
  }
  return `<${hostTag} ${attributes.join(' ')}></${hostTag}>`;
}

/**
 * Builds a synthesized snippet from merged args without running the template
 * engine. Returns null when no sane snippet can be produced (attribute kind
 * without a derivable host tag) so the caller can omit it.
 */
export function synthesizeSnippet(
  context: SnippetContext,
  args: ArgsRecord,
  template: string | null,
): string | null {
  return context.kind === 'element'
    ? synthesizeElementSnippet(context, args)
    : synthesizeAttributeSnippet(context, args, template);
}

/** Whether the snippet actually references the component it documents. */
export function snippetReferencesComponent(snippet: string, context: SnippetContext): boolean {
  if (context.kind === 'element') {
    const pattern = new RegExp(`<${escapeRegExp(context.tagName)}[\\s/>]`);
    return pattern.test(snippet);
  }
  return findAttributeHostTag(snippet, context.attributeName) !== null;
}

function isDirective(expression: string): boolean {
  if (DIRECTIVE_PREFIX_PATTERN.test(expression)) return false;
  if (IDENTIFIER_PATTERN.test(expression)) return true;
  return IDENTIFIER_CALL_PATTERN.test(expression);
}

/** Consumes the closing quote of a dropped quoted attribute value, if any. */
function skipClosingQuote(template: string, index: number, tail: string): number {
  const quote = tail.endsWith('"') ? '"' : tail.endsWith("'") ? "'" : null;
  return quote !== null && template[index] === quote ? index + 1 : index;
}

function replaceExpressions(
  template: string,
  args: ArgsRecord,
  context: SnippetContext | null,
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
      const eventTail = EVENT_ATTRIBUTE_TAIL_PATTERN.exec(output);
      if (eventTail !== null) {
        output = output.slice(0, output.length - eventTail[0].length);
        i = skipClosingQuote(template, expressionEnd, eventTail[0]);
        continue;
      }
      if (isDirective(expression)) {
        output = output.replace(/[ \t\n]+$/, '');
        i = expressionEnd;
        continue;
      }
      const resolved = resolveExpression(expression, args, context);
      if (resolved.status === 'unresolvable') return null;
      const quotedTail = QUOTED_ATTRIBUTE_TAIL_PATTERN.exec(output);
      const unquotedTail =
        quotedTail === null ? UNQUOTED_ATTRIBUTE_TAIL_PATTERN.exec(output) : null;
      const tail = quotedTail ?? unquotedTail;
      if (resolved.status === 'missing') {
        // Absent arg in an attribute binding: the attribute is dropped (mirrors
        // Lit, where an undefined binding value removes the attribute) unless
        // the value is interpolated as raw text (quoted, non-boolean), which
        // cannot be guessed and fails fast.
        if (tail === null || (quotedTail !== null && tail[1] !== '?')) return null;
        output = output.slice(0, output.length - tail[0].length);
        i = quotedTail !== null ? skipClosingQuote(template, expressionEnd, '"') : expressionEnd;
        continue;
      }
      if (tail !== null) {
        const name = tail[2];
        if (resolved.status === 'boolean') {
          // Boolean attribute binding: truthy renders a bare attribute, falsy
          // drops the attribute (mirrors Lit's `?attr` semantics).
          output = output.slice(0, output.length - tail[0].length);
          if (resolved.value) {
            output = `${output.replace(/[ \t\n]+$/, '')} ${name}`;
          }
          i = quotedTail !== null ? skipClosingQuote(template, expressionEnd, '"') : expressionEnd;
          continue;
        }
        if (resolved.status === 'value') {
          if (quotedTail !== null) {
            output += resolved.value;
          } else if (resolved.value === '') {
            output = output.slice(0, output.length - tail[0].length);
          } else {
            output += `"${resolved.value}"`;
          }
          i = expressionEnd;
          continue;
        }
        // `empty` (ifDefined without value): drop the whole attribute.
        output = output.slice(0, output.length - tail[0].length);
        i = skipClosingQuote(template, expressionEnd, quotedTail === null ? '' : '"');
        continue;
      }
      if (resolved.status === 'empty') {
        i = expressionEnd;
        continue;
      }
      if (resolved.status === 'boolean') return null;
      output += resolved.value;
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
  context: SnippetContext | null = null,
): string | null {
  const withoutComments = template.replace(/<!--[\s\S]*?-->/g, '');
  const replaced = replaceExpressions(withoutComments, args, context);
  if (replaced === null) return null;
  const withoutBlankLines = replaced
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
  const trimmed = withoutBlankLines.trim();
  if (trimmed === '') return null;
  return joinSplitTags(trimmed);
}

/**
 * Joins closing tags and their `>` broken across lines by the Lit template
 * formatting (e.g. `</esds-badge\n    >` and `<a ...\n    >Text</a\n    >`).
 */
function joinSplitTags(snippet: string): string {
  const joinedClosing = snippet.replace(SPLIT_CLOSING_TAG_PATTERN, '</$1>');
  return joinedClosing.replace(SPLIT_OPEN_TAG_GT_PATTERN, '>');
}

export function humanizeExportName(exportName: string): string {
  return exportName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

export function buildStorySnippets(input: {
  context: SnippetContext;
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
    const cleaned = template === null ? null : cleanRenderTemplate(template, merged, input.context);
    const code =
      cleaned !== null && snippetReferencesComponent(cleaned, input.context)
        ? cleaned
        : synthesizeSnippet(input.context, explicit, template);
    if (code === null) continue;
    snippets.push({
      name: humanizeExportName(story.exportName),
      description: story.jsdoc ?? undefined,
      code,
    });
  }
  return snippets;
}
