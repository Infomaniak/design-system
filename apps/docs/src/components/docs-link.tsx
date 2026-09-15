import React from 'react';

export interface DocsLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'rel'> {
  readonly href?: string | undefined;
  readonly rel?: string | string[] | undefined;
}

const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;
const SECURITY_REL_TOKENS = ['noopener', 'noreferrer'];

export const isExternalHref = (href: string | null | undefined): boolean =>
  !!href && EXTERNAL_HREF_PATTERN.test(href);

/**
 * Storybook's MDX pipeline (rehype-external-links) may inject a rel attribute
 * (e.g. ['nofollow']) before the component receives it. Merge it with the
 * security tokens required by target="_blank" instead of dropping either.
 */
const buildRel = (incoming: string | string[] | undefined): string => {
  const tokens = new Set(
    (Array.isArray(incoming) ? incoming : (incoming?.split(/\s+/) ?? [])).filter(Boolean),
  );
  SECURITY_REL_TOKENS.forEach((token) => tokens.add(token));
  return Array.from(tokens).join(' ');
};

/**
 * Anchor for docs content. External links (absolute http(s) URLs) open in a new
 * tab and get a visual cue; internal links (relative paths, anchors, mailto)
 * render as plain anchors. Used as the `a` override for MDX and token markdown.
 */
const DocsLink: React.FC<DocsLinkProps> = ({ children, href, rel, ...rest }) => {
  if (!isExternalHref(href)) {
    return (
      <a
        href={href}
        rel={rel}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
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
};

export default DocsLink;
