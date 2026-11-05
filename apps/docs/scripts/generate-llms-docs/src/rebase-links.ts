import { join, relative } from 'node:path/posix';
import { isRootFileTarget } from './page-renderer.ts';
import { transformOutsideFences } from './raw-md.ts';

/**
 * Matches a markdown link or image, e.g. `[Typography](./tokens.md)` or
 * `![Palette](./palette.png)`.
 */
const MD_LINK_PATTERN: RegExp = /\[([^\]]*)\]\(\s*([^)\s]+)\s*\)/g;

/**
 * Matches an `href` or `src` attribute of inline HTML, e.g. `href="./tokens.md"`.
 */
const HTML_ATTR_PATTERN: RegExp = /(href|src)=(["'])([^"'\s]*)\2/g;

function isRebasable(target: string): boolean {
  return (
    target !== '' &&
    !target.includes('?') &&
    !target.startsWith('/') &&
    !target.startsWith('#') &&
    !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)
  );
}

/**
 * Rebases a relative link target from the directory `fromDir` to the site
 * root. Root resource files are emitted as bare names; targets that cannot be
 * rebased (external, absolute, hash- or query-only, or escaping the site
 * root) return null to keep the original match.
 */
function rebaseTarget(target: string, fromDir: string): string | null {
  if (!isRebasable(target)) {
    return null;
  }
  if (isRootFileTarget(target)) {
    return target.replace(/^\.{1,2}\//, '');
  }
  const rebased = relative('.', join(fromDir, target));
  return rebased === '' ? null : rebased;
}

/**
 * Rewrites the relative links of a rendered page from the page's own
 * directory to the site root, so the same content also resolves from
 * site-root documents such as llms-full.txt. Root resource files keep their
 * site-root meaning; fenced code blocks and external, absolute, hash- or
 * query-only targets are left untouched. Applies exactly once: the input must
 * be page-rendered markdown, not already-rebased content.
 */
export function rebaseRelativeLinks(markdown: string, fromDir: string): string {
  return transformOutsideFences(markdown, (text) =>
    text
      .replace(MD_LINK_PATTERN, (match, label: string, target: string) => {
        const rebased = rebaseTarget(target, fromDir);
        return rebased === null ? match : `[${label}](${rebased})`;
      })
      .replace(HTML_ATTR_PATTERN, (match, attribute: string, quote: string, target: string) => {
        const rebased = rebaseTarget(target, fromDir);
        return rebased === null ? match : `${attribute}=${quote}${rebased}${quote}`;
      }),
  );
}

/**
 * Collects the unique relative link targets of the markdown, ignoring fenced
 * code blocks and non-rebasable targets (external, absolute, hash- or
 * query-only). Hashes are kept so callers can validate the file part
 * separately.
 */
export function collectRelativeLinkTargets(markdown: string): Set<string> {
  const targets = new Set<string>();
  transformOutsideFences(markdown, (text) =>
    text
      .replace(MD_LINK_PATTERN, (match, _label: string, target: string) => {
        addTarget(targets, target);
        return match;
      })
      .replace(HTML_ATTR_PATTERN, (match, _attribute: string, _quote: string, target: string) => {
        addTarget(targets, target);
        return match;
      }),
  );
  return targets;
}

function addTarget(targets: Set<string>, target: string): void {
  if (isRebasable(target)) {
    targets.add(target);
  }
}
