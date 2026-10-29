import { dirname, join } from 'node:path';
import { parseCem } from './cem.ts';
import {
  buildStoryLinkTargets,
  groupEntriesByTitle,
  orderTitleGroups,
  parseStorybookIndex,
} from './index-entries.ts';
import { renderLlmsFullTxt } from './llms-full-txt.ts';
import { renderLlmsTxt, validateLlmsTxtTargets } from './llms-txt.ts';
import { buildPageModel, relativizeRootFileLinks, renderPageMarkdown } from './page-renderer.ts';

export interface GenerateLlmsDocsOptions {
  distDir: string;
  appsDocsDir: string;
  componentsDir: string;
  designMdPath: string;
  baseUrl: string;
  /**
   * When set, llms.txt and llms-full.txt are also written here so the docs
   * dev server serves them at the site root, like DESIGN.md.
   */
  publicDir?: string;
}

export interface FileSystemDeps {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  mkdir: (path: string, options: { recursive: true }) => void;
}

export interface GenerateLlmsDocsResult {
  pageCount: number;
  fileCount: number;
}

function readOptionalFile(readFile: (path: string) => string, path: string): string | null {
  try {
    return readFile(path);
  } catch {
    return null;
  }
}

export function generateLlmsDocs(
  options: GenerateLlmsDocsOptions,
  deps: FileSystemDeps,
): GenerateLlmsDocsResult {
  const index = parseStorybookIndex(deps.readFile(join(options.distDir, 'index.json')));
  const groups = orderTitleGroups(groupEntriesByTitle(Object.values(index.entries)));
  const storyLinkTargets = buildStoryLinkTargets(groups);
  const cem = parseCem(deps.readFile(join(options.componentsDir, 'custom-elements.json')));

  const pages = groups.map((group) =>
    buildPageModel({
      group,
      cem,
      storyLinkTargets,
      sources: { readFile: deps.readFile, appsDocsDir: options.appsDocsDir },
    }),
  );

  let fileCount = 0;
  for (const page of pages) {
    const filePath = join(options.distDir, page.outputPath);
    deps.mkdir(dirname(filePath), { recursive: true });
    deps.writeFile(filePath, relativizeRootFileLinks(renderPageMarkdown(page), page.outputPath));
  }
  fileCount += pages.length;

  const designMd = readOptionalFile(deps.readFile, options.designMdPath);
  const llmsFullTxt = renderLlmsFullTxt({ pages, designMd });
  deps.writeFile(join(options.distDir, 'llms-full.txt'), llmsFullTxt);
  fileCount += 1;

  const llmsTxt = renderLlmsTxt({
    pages,
    baseUrl: options.baseUrl,
    designMdAvailable: designMd !== null,
  });
  validateLlmsTxtTargets({
    distDir: options.distDir,
    targets: [
      ...pages.map((page) => page.outputPath),
      'llms-full.txt',
      ...(designMd !== null ? ['DESIGN.md'] : []),
    ],
    readFile: deps.readFile,
  });
  deps.writeFile(join(options.distDir, 'llms.txt'), llmsTxt);
  fileCount += 1;

  if (options.publicDir !== undefined) {
    deps.mkdir(options.publicDir, { recursive: true });
    deps.writeFile(join(options.publicDir, 'llms-full.txt'), llmsFullTxt);
    deps.writeFile(join(options.publicDir, 'llms.txt'), llmsTxt);
  }

  return { pageCount: pages.length, fileCount };
}
