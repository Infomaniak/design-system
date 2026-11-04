import type { PageModel } from './types.ts';

export interface GeneratedPageIssue {
  page: string;
  story: string;
  message: string;
}

const OPEN_TAG_PATTERN = /<([a-zA-Z][\w-]*)([^>]*)>/g;
const TAG_ATTRIBUTE_PATTERN = /([A-Za-z][\w-]*)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;

/**
 * Collects the invalid snippets of the generated pages:
 *
 * - a custom attribute name (e.g. `esds-button`) used as an element tag
 *   (`<esds-button …>`), which produces phantom elements in the docs;
 * - a camelCase attribute on an element-kind snippet that is not a CEM
 *   attribute (HTML attributes are case-insensitive kebab-case, so camelCase
 *   names are leaked Storybook controls, e.g. `buttonType="…"`);
 */
export function collectGeneratedPageIssues(input: {
  pages: readonly PageModel[];
  attributeTagNames: ReadonlySet<string>;
}): GeneratedPageIssue[] {
  const issues: GeneratedPageIssue[] = [];
  for (const page of input.pages) {
    for (const snippet of page.examples) {
      issues.push(
        ...collectSnippetIssues(page, snippet.name, snippet.code, input.attributeTagNames),
      );
    }
  }
  return issues;
}

function collectSnippetIssues(
  page: PageModel,
  story: string,
  snippet: string,
  attributeTagNames: ReadonlySet<string>,
): GeneratedPageIssue[] {
  const issues: GeneratedPageIssue[] = [];
  for (const attributeName of attributeTagNames) {
    if (!usesElementTag(snippet, attributeName)) continue;
    issues.push({
      page: page.title,
      story,
      message: `uses the custom attribute "${attributeName}" as an element tag`,
    });
  }
  if (page.componentKind === 'element') {
    for (const attributeName of collectSnippetAttributeNames(snippet)) {
      if (!/[A-Z]/.test(attributeName)) continue;
      if (page.componentAttributeNames.includes(attributeName)) continue;
      issues.push({
        page: page.title,
        story,
        message: `attribute "${attributeName}" is not a CEM attribute of ${page.componentTagName ?? 'the component'}`,
      });
    }
  }
  return issues;
}

function usesElementTag(snippet: string, tagName: string): boolean {
  return new RegExp(`<${escapeRegExp(tagName)}[\\s/>]`).test(snippet);
}

/**
 * Extracts the attribute names of the open tags of the snippet. Only meaningful
 * for element-kind snippets, where the snippet root is the component tag.
 */
function collectSnippetAttributeNames(snippet: string): string[] {
  const names: string[] = [];
  for (const match of snippet.matchAll(OPEN_TAG_PATTERN)) {
    for (const attributeMatch of match[2].matchAll(TAG_ATTRIBUTE_PATTERN)) {
      names.push(attributeMatch[1]);
    }
  }
  return names;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatGeneratedPageIssues(issues: readonly GeneratedPageIssue[]): string {
  return issues.map((issue) => `- ${issue.page} / ${issue.story}: ${issue.message}`).join('\n');
}

/**
 * Throws when any generated page contains an invalid snippet, so the docs build
 * fails loudly instead of shipping broken examples.
 */
export function validateGeneratedPages(input: {
  pages: readonly PageModel[];
  attributeTagNames: ReadonlySet<string>;
}): void {
  const issues = collectGeneratedPageIssues(input);
  if (issues.length === 0) return;
  throw new Error(`Invalid generated page snippets:\n${formatGeneratedPageIssues(issues)}`);
}
