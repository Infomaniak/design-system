import { DocsContext, type DocsContextProps } from '@storybook/addon-docs/blocks';
import React, { useContext } from 'react';
import { NAVIGATE_URL } from 'storybook/internal/core-events';

export interface DocsLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'rel'> {
  readonly href?: string | undefined;
  readonly rel?: string | string[] | undefined;
}

const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;
const SECURITY_REL_TOKENS = ['noopener', 'noreferrer'];

export const isExternalHref = (href: string | null | undefined): boolean =>
  !!href && EXTERNAL_HREF_PATTERN.test(href);

/**
 * Manager paths written without the `?path=` query prefix: `/docs/x--docs` and
 * `/story/x--docs` (absolute) resolve outside the deployed base path (404) when
 * rendered inside the preview iframe.
 */
const MANAGER_PATH_PATTERN = /^\/(?:docs|story)\//;

/**
 * Bare `?path=…` / `/?path=…` queries resolve against the preview iframe URL
 * (iframe.html) instead of the app root.
 */
const BARE_QUERY_PATTERN = /^\/?\?path=/;

interface InternalAppLink {
  /** href to render — resolvable from the preview iframe to the app URL */
  readonly href: string;
  /** href forwarded to the manager through NAVIGATE_URL */
  readonly navigateHref: string;
}

/**
 * Reads the current docs entry id from the preview iframe URL
 * (iframe.html?viewMode=docs&id=<entry-id>).
 */
const getCurrentDocsEntryId = (): string | null =>
  new URLSearchParams(window.location.search).get('id');

/**
 * Docs content renders inside the preview iframe (iframe.html), so naive hrefs
 * resolve against the iframe URL instead of the Storybook app:
 *
 * - `#anchor` targets `iframe.html#anchor`,
 * - `?path=/docs/x--docs` targets `iframe.html?path=…`,
 * - `/docs/x--docs` escapes the deployed base path entirely (404).
 *
 * Internal links are therefore normalized to iframe-relative app URLs
 * (`./?path=…`) and their clicks routed through Storybook's `NAVIGATE_URL`
 * event, so the manager navigates — and in-page anchors scroll — inside the
 * running app instead of reloading the preview iframe.
 */
const asInternalAppLink = (href: string): InternalAppLink | null => {
  if (href.startsWith('#')) {
    const docsEntryId = getCurrentDocsEntryId();
    // Without a docs entry in the iframe URL there is nothing to resolve
    // against; keep the raw anchor so the browser scrolls the iframe natively.
    return docsEntryId ? { href: `./?path=/docs/${docsEntryId}${href}`, navigateHref: href } : null;
  }
  if (MANAGER_PATH_PATTERN.test(href)) {
    const appHref = `./?path=${href}`;
    return { href: appHref, navigateHref: appHref };
  }
  if (BARE_QUERY_PATTERN.test(href)) {
    // "." + "/?path=/docs/x--docs" and "./" + "?path=/docs/x--docs" both yield
    // "./?path=/docs/x--docs", resolvable from the iframe to the app root.
    const appHref = href.startsWith('/') ? `.${href}` : `./${href}`;
    return { href: appHref, navigateHref: appHref };
  }
  if (href.startsWith('./?path=')) {
    return { href, navigateHref: href };
  }
  return null;
};

/**
 * Merge upstream rel tokens with the security tokens required by
 * target="_blank" instead of dropping either. Storybook's MDX pipeline
 * (rehype-external-links) may inject a rel attribute (e.g. ['nofollow']) before
 * the component receives it.
 */
const buildRel = (incoming: string | string[] | undefined): string => {
  const tokens = new Set(
    (Array.isArray(incoming) ? incoming : (incoming?.split(/\s+/) ?? [])).filter(Boolean),
  );
  SECURITY_REL_TOKENS.forEach((token) => tokens.add(token));
  return Array.from(tokens).join(' ');
};

/**
 * Clicks the browser must handle itself instead of the in-app routing:
 * modified clicks (open in new tab / new window), non-primary buttons and
 * links with an explicit non-`_self` target keep navigating the normalized
 * href natively.
 */
const isBrowserHandledClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  target: string | undefined,
): boolean =>
  event.button !== 0 ||
  event.metaKey ||
  event.altKey ||
  event.ctrlKey ||
  event.shiftKey ||
  (target !== undefined && target !== '_self');

/**
 * Anchor for docs content. External links (absolute http(s) URLs) open in a new
 * tab and get a visual cue; internal links are normalized and routed through
 * the Storybook channel on unmodified primary clicks — other clicks (modified
 * clicks, explicit targets) keep the native navigation. Used as the `a`
 * override for MDX and token markdown.
 */
const DocsLink: React.FC<DocsLinkProps> = ({ children, href, rel, onClick, ...rest }) => {
  const context = useContext(DocsContext) as DocsContextProps | null;
  const channel = context?.channel;

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        onClick={onClick}
        {...rest}
        target="_blank"
        rel={buildRel(rel)}
      >
        {children}
        <esds-icon
          className="docs-external-link-icon"
          name="esds:square-arrow-out-up-right"
          inline
        />
      </a>
    );
  }

  if (href) {
    const appLink = asInternalAppLink(href);

    if (appLink) {
      const routedClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (isBrowserHandledClick(event, rest.target)) return;
        event.preventDefault();
        channel?.emit(NAVIGATE_URL, appLink.navigateHref);
      };

      return (
        <a
          href={appLink.href}
          rel={buildRel(rel)}
          onClick={channel ? routedClick : onClick}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        rel={buildRel(rel)}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      rel={buildRel(rel)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
};

export default DocsLink;
