import { join } from 'node:path';
import type { PageModel } from './types.ts';

export const DESIGN_SYSTEM_NAME = 'Infomaniak Design System';

export const DESIGN_SYSTEM_TAGLINE =
  'Official Lit web components library, DTCG design tokens, and usage guidelines for Infomaniak web applications.';

const CORE_RULES = [
  "Always import components from the root package (`import { EsdsIconComponent } from '@infomaniak-design-system/components'`) and call `.define()` on each component before rendering any `<esds-*>` element.",
  'Never hardcode hex colors, spacing, or typography values; always use the semantic design token CSS custom properties documented in these pages.',
  'Prefer composing the existing components over re-implementing them with custom CSS; the look and feel is owned by the token layer, not by consumers.',
  'DESIGN.md is already included at the top of llms-full.txt, so ingest one or the other, not both.',
].join(' ');

const OPTIONAL_TITLE_SUFFIXES = ['CHANGELOG', 'DESIGN.md'];

export function buildLinkUrl(outputPath: string, baseUrl: string): string {
  if (baseUrl === '') return outputPath;
  return `${baseUrl.replace(/\/+$/, '')}/${outputPath}`;
}

function formatLink(page: PageModel, baseUrl: string): string {
  const url = buildLinkUrl(page.outputPath, baseUrl);
  return page.summary === ''
    ? `- [${page.title}](${url})`
    : `- [${page.title}](${url}): ${page.summary}`;
}

function isOptionalPage(page: PageModel): boolean {
  const lastSegment = page.title.slice(page.title.lastIndexOf('/') + 1);
  return OPTIONAL_TITLE_SUFFIXES.includes(lastSegment);
}

export function renderLlmsTxt(input: {
  pages: PageModel[];
  baseUrl: string;
  designMdAvailable: boolean;
}): string {
  const sections: string[] = [];
  sections.push(`# ${DESIGN_SYSTEM_NAME}`);
  sections.push(`> ${DESIGN_SYSTEM_TAGLINE}`);
  const fullUrl = buildLinkUrl('llms-full.txt', input.baseUrl);
  sections.push(
    `${CORE_RULES}\n\nFor complete single-file context ingestion, see [Full Design System Documentation](${fullUrl}).`,
  );

  const byCategory = new Map<string, PageModel[]>();
  for (const page of input.pages) {
    if (isOptionalPage(page)) continue;
    const existing = byCategory.get(page.category) ?? [];
    existing.push(page);
    byCategory.set(page.category, existing);
  }
  for (const [category, pages] of byCategory) {
    const links = pages.map((page) => formatLink(page, input.baseUrl));
    sections.push(`## ${category}\n\n${links.join('\n')}`);
  }

  const optionalPages = input.pages.filter(isOptionalPage);
  const optionalLinks = optionalPages.map((page) => formatLink(page, input.baseUrl));
  if (input.designMdAvailable) {
    optionalLinks.push(
      `- [DESIGN.md (raw token reference)](${buildLinkUrl('DESIGN.md', input.baseUrl)}): Machine-readable token hierarchy with resolved values for all themes, optimized for AI consumption.`,
    );
  }
  if (optionalLinks.length > 0) {
    sections.push(`## Optional\n\n${optionalLinks.join('\n')}`);
  }

  return `${sections.join('\n\n')}\n`;
}

/**
 * Verifies every file referenced by llms.txt exists and is non-empty in the
 * dist directory. Targets are the dist-relative paths the generator itself
 * constructs; prose links inside page summaries are not validated.
 */
export function validateLlmsTxtTargets(input: {
  distDir: string;
  targets: string[];
  readFile: (path: string) => string;
}): void {
  for (const target of input.targets) {
    let content: string;
    try {
      content = input.readFile(join(input.distDir, target));
    } catch {
      throw new Error(`Missing llms.txt target: ${target}`);
    }
    if (content.trim() === '') {
      throw new Error(`Empty llms.txt target: ${target}`);
    }
  }
}
