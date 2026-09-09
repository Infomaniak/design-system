import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DocsLink, { isExternalHref } from './docs-link.tsx';

describe('isExternalHref', () => {
  it('recognizes absolute http(s) URLs as external, case-insensitively', () => {
    expect(isExternalHref('https://www.figma.com/design/xxx')).toBe(true);
    expect(isExternalHref('HTTP://infomaniak.com')).toBe(true);
  });

  it('treats internal hrefs as non-external', () => {
    expect(isExternalHref('/?path=/docs/designers-guide-getting-started--docs')).toBe(false);
    expect(isExternalHref('#contribution')).toBe(false);
    expect(isExternalHref('mailto:design@infomaniak.com')).toBe(false);
    expect(isExternalHref('')).toBe(false);
    expect(isExternalHref(undefined)).toBe(false);
    expect(isExternalHref(null)).toBe(false);
  });
});

describe('DocsLink', () => {
  it('opens external links in a new tab and appends the external icon', () => {
    render(
      <DocsLink
        href="https://www.figma.com/design/xxx"
        title="Open in Figma"
      >
        Figma file
      </DocsLink>,
    );

    const link = screen.getByText('Figma file').closest('a')!;
    expect(link).toHaveAttribute('href', 'https://www.figma.com/design/xxx');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('title', 'Open in Figma');

    const icon = link.querySelector('esds-icon')!;
    expect(icon).toHaveAttribute('name', 'esds:square-arrow-out-up-right');
    expect(icon).toHaveAttribute('inline');
  });

  it.each([
    ['relative path', '/?path=/docs/designers-guide-getting-started--docs'],
    ['anchor', '#contribution'],
    ['mailto', 'mailto:design@infomaniak.com'],
  ])('renders %s links as plain anchors', (_label, href) => {
    render(<DocsLink href={href}>Guide</DocsLink>);

    const link = screen.getByText('Guide').closest('a')!;
    expect(link).toHaveAttribute('href', href);
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(link.querySelector('esds-icon')).toBeNull();
  });

  it('renders an anchor without href when none is provided', () => {
    render(<DocsLink>No link</DocsLink>);

    const link = screen.getByText('No link').closest('a')!;
    expect(link).not.toHaveAttribute('href');
    expect(link.querySelector('esds-icon')).toBeNull();
  });

  it('always opens external links in a new tab, ignoring a caller-provided target', () => {
    render(
      <DocsLink
        href="https://infomaniak.com"
        target="_self"
      >
        Infomaniak
      </DocsLink>,
    );

    expect(screen.getByText('Infomaniak').closest('a')).toHaveAttribute('target', '_blank');
  });

  it('merges upstream rel tokens with the security tokens on external links', () => {
    render(
      <DocsLink
        href="https://infomaniak.com"
        rel={['nofollow']}
      >
        Infomaniak
      </DocsLink>,
    );

    expect(screen.getByText('Infomaniak').closest('a')).toHaveAttribute(
      'rel',
      'nofollow noopener noreferrer',
    );
  });

  it('merges string rel values and deduplicates tokens', () => {
    render(
      <DocsLink
        href="https://infomaniak.com"
        rel="nofollow noopener"
      >
        Infomaniak
      </DocsLink>,
    );

    expect(screen.getByText('Infomaniak').closest('a')).toHaveAttribute(
      'rel',
      'nofollow noopener noreferrer',
    );
  });

  it('preserves a caller-provided rel on internal links', () => {
    render(
      <DocsLink
        href="/?path=/docs/x--docs"
        rel="nofollow"
      >
        Guide
      </DocsLink>,
    );

    const link = screen.getByText('Guide').closest('a')!;
    expect(link).toHaveAttribute('rel', 'nofollow');
    expect(link).not.toHaveAttribute('target');
  });
});
