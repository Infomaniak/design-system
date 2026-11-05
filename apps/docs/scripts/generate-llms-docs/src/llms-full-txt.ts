import { join } from 'node:path';
import { dirname } from 'node:path/posix';
import { renderPageMarkdown } from './page-renderer.ts';
import { collectRelativeLinkTargets, rebaseRelativeLinks } from './rebase-links.ts';
import type { PageModel } from './types.ts';

export function renderLlmsFullTxt(input: { pages: PageModel[]; designMd: string | null }): string {
  const parts: string[] = [];
  if (input.designMd !== null && input.designMd.trim() !== '') {
    parts.push(input.designMd.trim());
  }
  for (const page of input.pages) {
    const markdown = rebaseRelativeLinks(renderPageMarkdown(page), dirname(page.outputPath));
    parts.push(markdown.trim());
  }
  return `${parts.join('\n\n---\n\n')}\n`;
}

/**
 * Verifies every relative link target of the page-derived parts of
 * llms-full.txt resolves to a non-empty file in the dist directory. The
 * DESIGN.md part is skipped: it is authored at the site root and copied
 * verbatim, so its own links are not the llms generator's responsibility.
 * Prose links inside page summaries are not validated either.
 */
export function validateLlmsFullTxtLinks(input: {
  distDir: string;
  content: string;
  designMd: string | null;
  readFile: (path: string) => string;
}): void {
  let pageContent = input.content;
  const designMd = input.designMd !== null ? input.designMd.trim() : null;
  if (designMd !== null && designMd !== '' && pageContent.startsWith(designMd)) {
    pageContent = pageContent.slice(designMd.length);
  }
  for (const target of collectRelativeLinkTargets(pageContent)) {
    const file = target.replace(/#.*$/, '');
    let content: string;
    try {
      content = input.readFile(join(input.distDir, file));
    } catch {
      throw new Error(`Missing llms-full.txt link target: ${file}`);
    }
    if (content.trim() === '') {
      throw new Error(`Empty llms-full.txt link target: ${file}`);
    }
  }
}
