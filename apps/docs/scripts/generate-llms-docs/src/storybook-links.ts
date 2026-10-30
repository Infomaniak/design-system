import { dirname, relative } from 'node:path/posix';
import { transformOutsideFences } from './raw-md.ts';

/**
 * Matches markdown links pointing to a Storybook page, e.g.
 * `[T1](./?path=/docs/design-tokens-t1--docs)`.
 */
const STORYBOOK_MD_LINK_PATTERN: RegExp =
  /\[([^\]]*)\]\(\s*((?:\.{0,2}\/)?\?path=\/docs\/[^)\s]*)\s*\)/g;

/**
 * Matches `href` attributes pointing to a Storybook page, e.g.
 * `href="./?path=/docs/designers-guide-figma-plugins--docs#esds-icons"`.
 */
const STORYBOOK_HREF_PATTERN: RegExp = /href=(["'])((?:\.{0,2}\/)?\?path=\/docs\/[^"'\s]*)\1/g;

const STORYBOOK_DOCS_URL_PATTERN: RegExp =
  /^(?:\.{0,2}\/)?\?path=\/docs\/([A-Za-z0-9_-]+?--docs)(#[^\s"#]+)?/;

interface StorybookDocsLink {
  id: string;
  hash: string;
}

/**
 * Rewrites the Storybook `?path=/docs/...` links of a generated page into
 * relative links to the generated markdown pages, so AI agents consuming
 * llms-full.txt can follow them. Links whose story id has no generated page
 * are downgraded to their label; other URLs are left untouched.
 */
export function relativizeStorybookLinks(
  markdown: string,
  storyLinkTargets: ReadonlyMap<string, string>,
  outputPath: string,
): string {
  return transformOutsideFences(markdown, (text) =>
    text
      .replace(STORYBOOK_MD_LINK_PATTERN, (match, label: string, url: string) => {
        const target = rewriteStorybookUrl(url, storyLinkTargets, outputPath);
        if (target === null) {
          return match;
        }
        return target === '' ? label : `[${label}](${target})`;
      })
      .replace(STORYBOOK_HREF_PATTERN, (match, quote: string, url: string) => {
        const target = rewriteStorybookUrl(url, storyLinkTargets, outputPath);
        if (target === null) {
          return match;
        }
        return target === '' ? '' : `href=${quote}${target}${quote}`;
      }),
  );
}

function rewriteStorybookUrl(
  url: string,
  storyLinkTargets: ReadonlyMap<string, string>,
  outputPath: string,
): string | null {
  const link = parseStorybookDocsUrl(url);
  if (link === null) {
    return null;
  }
  const targetPath = storyLinkTargets.get(link.id);
  if (targetPath === undefined) {
    return '';
  }
  return `${relative(dirname(outputPath), targetPath)}${link.hash}`;
}

function parseStorybookDocsUrl(url: string): StorybookDocsLink | null {
  const match = STORYBOOK_DOCS_URL_PATTERN.exec(url);
  if (match === null) {
    return null;
  }
  return { id: match[1]!, hash: match[2] ?? '' };
}
