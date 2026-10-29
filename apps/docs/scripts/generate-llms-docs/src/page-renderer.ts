import { resolve } from 'node:path';
import { findElementByTagName, renderApiSection, type CustomElementsManifest } from './cem.ts';
import { loadComponentDocs, resolveImportPath } from './component-docs.ts';
import { buildOutputPath, slugifyTitle } from './index-entries.ts';
import { cleanMdxContent, extractRawMdImports } from './raw-md.ts';
import { buildStorySnippets, parseStoriesFile, type ArgsRecord } from './story-snippets.ts';
import { relativizeStorybookLinks } from './storybook-links.ts';
import type { CemElementDocs, PageModel, StorySnippet, TitleGroup } from './types.ts';

export interface PageSources {
  readFile: (path: string) => string;
  appsDocsDir: string;
}

const SUMMARY_MAX_LENGTH = 120;

/**
 * Root resource files (llms.txt, llms-full.txt, DESIGN.md) live at the site
 * root, so links to them written in MDX are correct for the Storybook page and
 * llms-full.txt, but not from generated pages which sit under `llms/`.
 */
const ROOT_FILE_LINK_PATTERN = /\]\((?:\.{1,2}\/)?(llms\.txt|llms-full\.txt|DESIGN\.md)\)/g;

export function buildPageModel(input: {
  group: TitleGroup;
  cem: CustomElementsManifest;
  storyLinkTargets: ReadonlyMap<string, string>;
  sources: PageSources;
}): PageModel {
  const { group, cem, storyLinkTargets, sources } = input;
  const slugParts = slugifyTitle(group.title);
  const categoryEnd = group.title.indexOf('/');
  const category = categoryEnd < 0 ? group.title : group.title.slice(0, categoryEnd).trim();
  const outputPath = buildOutputPath(slugParts);
  const docsEntry = group.docsEntry;

  let prose = '';
  let tagName: string | null = null;
  let storiesSource: string | null = null;

  if (docsEntry !== undefined) {
    const entryPath = resolve(sources.appsDocsDir, docsEntry.importPath);
    if (docsEntry.importPath.endsWith('.mdx')) {
      prose = resolveMdxProse(entryPath, sources.readFile);
    } else {
      const storiesFilePath = entryPath;
      storiesSource = sources.readFile(storiesFilePath);
      const docs = loadComponentDocs({
        storiesFilePath,
        storiesSource,
        readFile: sources.readFile,
      });
      prose = docs.prose ?? '';
      tagName = docs.tagName;
    }
  }

  prose = stripLeadingH1(prose);
  prose = relativizeStorybookLinks(prose, storyLinkTargets, outputPath);

  const cemDocs = tagName === null ? null : findElementByTagName(cem, tagName);
  const examples =
    storiesSource === null || cemDocs === null ? [] : buildStoryExamples(storiesSource, cemDocs);

  return {
    title: group.title,
    category,
    slugParts,
    outputPath,
    summary: extractSummary(prose),
    prose,
    importSection: buildImportSection(cemDocs, prose),
    props: cemDocs === null ? '' : renderApiSection(cemDocs),
    examples,
  };
}

function resolveMdxProse(mdxPath: string, readFile: (path: string) => string): string {
  const mdxSource = readFile(mdxPath);
  const resolved = new Map<string, string>();
  for (const rawImport of extractRawMdImports(mdxSource)) {
    const mdPath = resolveImportPath(mdxPath, rawImport.importPath);
    resolved.set(rawImport.identifier, readFile(mdPath));
  }
  return cleanMdxContent(mdxSource, resolved);
}

function stripLeadingH1(prose: string): string {
  const lines = prose.split('\n');
  if (lines[0]?.startsWith('# ')) {
    return lines.slice(1).join('\n').replace(/^\n+/, '').trim();
  }
  return prose.trim();
}

function buildStoryExamples(storiesSource: string, cemDocs: CemElementDocs): StorySnippet[] {
  const parsed = parseStoriesFile(storiesSource);
  const cemDefaults: ArgsRecord = {};
  for (const attribute of cemDocs.attributes) {
    if (attribute.default !== undefined) {
      cemDefaults[attribute.name] = toArgsValue(attribute.default);
    }
  }
  return buildStorySnippets({
    tagName: cemDocs.tagName,
    cemDefaults,
    meta: parsed.meta,
    stories: parsed.stories,
  });
}

export function toArgsValue(raw: string): ArgsRecord[string] {
  const quoted = /^'(.*)'$/.exec(raw) ?? /^"(.*)"$/.exec(raw);
  if (quoted !== null) return quoted[1];
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
}

function buildImportSection(cemDocs: CemElementDocs | null, prose: string): string {
  if (cemDocs === null) return '';
  if (prose.includes('.define()')) return '';
  return `import { ${cemDocs.className} } from '@infomaniak-design-system/components';\n\n${cemDocs.className}.define();`;
}

export function extractSummary(prose: string, maxLength: number = SUMMARY_MAX_LENGTH): string {
  let inFence = false;
  const paragraph: string[] = [];
  for (const line of prose.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (trimmed === '') {
      if (paragraph.length > 0) break;
      continue;
    }
    const isStructure = /^([#>]|[-*] |\||<)/.test(trimmed) || /<\/\w+>/.test(trimmed);
    if (isStructure) {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(trimmed);
    if (paragraph.join(' ').length >= maxLength) break;
  }
  const summary = paragraph.join(' ');
  if (summary.length <= maxLength) return summary;
  return `${summary.slice(0, maxLength - 3).trimEnd()}...`;
}

export function renderPageMarkdown(page: PageModel): string {
  const sections: string[] = [`# ${page.title}`];
  if (page.summary !== '') {
    sections.push(`> ${page.summary}`);
  }
  if (page.importSection !== '') {
    sections.push(`## Import\n\n\`\`\`ts\n${page.importSection}\n\`\`\``);
  }
  if (page.prose !== '') {
    sections.push(page.prose);
  }
  if (page.props !== '') {
    sections.push(page.props);
  }
  if (page.examples.length > 0) {
    const blocks = page.examples.map((snippet) => {
      const description = snippet.description === undefined ? '' : `\n${snippet.description}\n`;
      return `### ${snippet.name}\n${description}\n\`\`\`html\n${snippet.code}\n\`\`\``;
    });
    sections.push(`## Examples\n\n${blocks.join('\n\n')}`);
  }
  return `${sections.join('\n\n')}\n`;
}

export function relativizeRootFileLinks(markdown: string, outputPath: string): string {
  const prefix = '../'.repeat(outputPath.split('/').length - 1);
  return markdown.replace(ROOT_FILE_LINK_PATTERN, (_match, file: string) => `](${prefix}${file})`);
}
