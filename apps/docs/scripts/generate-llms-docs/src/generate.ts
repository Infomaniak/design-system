import { dirname, join } from 'node:path';
import { parseCem } from './cem.ts';
import { groupEntriesByTitle, orderTitleGroups, parseStorybookIndex } from './index-entries.ts';
import { renderLlmsFullTxt } from './llms-full-txt.ts';
import { renderLlmsTxt, validateLlmsTxtLinks } from './llms-txt.ts';
import { buildPageModel, relativizeRootFileLinks, renderPageMarkdown } from './page-renderer.ts';

export interface GenerateLlmsDocsOptions {
  distDir: string;
  appsDocsDir: string;
  componentsDir: string;
  designMdPath: string;
  baseUrl: string;
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
  const cem = parseCem(deps.readFile(join(options.componentsDir, 'custom-elements.json')));

  const pages = groups.map((group) =>
    buildPageModel({
      group,
      cem,
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
  validateLlmsTxtLinks({
    llmsTxt,
    distDir: options.distDir,
    baseUrl: options.baseUrl,
    readFile: deps.readFile,
  });
  deps.writeFile(join(options.distDir, 'llms.txt'), llmsTxt);
  fileCount += 1;

  return { pageCount: pages.length, fileCount };
}
