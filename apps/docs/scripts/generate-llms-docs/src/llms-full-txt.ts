import { renderPageMarkdown } from './page-renderer.ts';
import type { PageModel } from './types.ts';

export function renderLlmsFullTxt(input: { pages: PageModel[]; designMd: string | null }): string {
  const parts: string[] = [];
  if (input.designMd !== null && input.designMd.trim() !== '') {
    parts.push(input.designMd.trim());
  }
  for (const page of input.pages) {
    parts.push(renderPageMarkdown(page).trim());
  }
  return `${parts.join('\n\n---\n\n')}\n`;
}
