import { DocsContext, type DocsContextProps } from '@storybook/addon-docs/blocks';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement, MouseEvent as ReactMouseEvent } from 'react';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DocsLink, { isExternalHref } from './docs-link.tsx';

const DOCS_ENTRY_ID = 'design-tokens-getting-started--docs';

const renderWithDocsChannel = (ui: ReactElement) => {
  const emit = vi.fn();
  const context = { channel: { emit } } as unknown as DocsContextProps;
  render(<DocsContext.Provider value={context}>{ui}</DocsContext.Provider>);
  return { emit };
};

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
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

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

  // The caller spy prevents the default action so the test stays independent
  // from browser navigation behavior.
  it('forwards caller-provided onClick on external links', () => {
    const onClick = vi.fn((event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    render(
      <DocsLink
        href="https://infomaniak.com"
        onClick={onClick}
      >
        Infomaniak
      </DocsLink>,
    );

    fireEvent.click(screen.getByText('Infomaniak'));
    expect(onClick).toHaveBeenCalled();
  });

  it.each([
    ['an in-page anchor (no docs entry in the iframe URL)', '#contribution', '#contribution'],
    ['a mailto link', 'mailto:design@infomaniak.com', 'mailto:design@infomaniak.com'],
    [
      'a bare ?path query',
      '?path=/docs/designers-guide-getting-started--docs',
      './?path=/docs/designers-guide-getting-started--docs',
    ],
    [
      'a root-relative ?path query',
      '/?path=/docs/designers-guide-getting-started--docs',
      './?path=/docs/designers-guide-getting-started--docs',
    ],
    [
      'an absolute /docs path',
      '/docs/designers-guide-getting-started--docs',
      './?path=/docs/designers-guide-getting-started--docs',
    ],
  ])('renders %s as an internal anchor resolving to %s', (_label, href, expectedHref) => {
    render(<DocsLink href={href}>Guide</DocsLink>);

    const link = screen.getByText('Guide').closest('a')!;
    expect(link).toHaveAttribute('href', expectedHref);
    expect(link).not.toHaveAttribute('target');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('esds-icon')).toBeNull();
  });

  it('renders an anchor without href when none is provided', () => {
    render(<DocsLink>No link</DocsLink>);

    const link = screen.getByText('No link').closest('a')!;
    expect(link).not.toHaveAttribute('href');
    expect(link.querySelector('esds-icon')).toBeNull();
  });

  // The caller spy prevents the default action: happy-dom would otherwise
  // resolve the mailto: URL into window.location and pollute the next tests.
  it.each([
    ['a raw in-page anchor', '#contribution'],
    ['a mailto link', 'mailto:design@infomaniak.com'],
  ])('forwards caller-provided onClick on %s without routing', (_label, href) => {
    const onClick = vi.fn((event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    const { emit } = renderWithDocsChannel(
      <DocsLink
        href={href}
        onClick={onClick}
      >
        Guide
      </DocsLink>,
    );

    fireEvent.click(screen.getByText('Guide'));
    expect(onClick).toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('forwards caller-provided onClick on anchors without href', () => {
    const onClick = vi.fn();
    render(<DocsLink onClick={onClick}>No link</DocsLink>);

    fireEvent.click(screen.getByText('No link'));
    expect(onClick).toHaveBeenCalled();
  });

  it('merges caller-provided rel tokens with the security tokens on internal links', () => {
    render(
      <DocsLink
        href="./?path=/docs/x--docs"
        rel="nofollow"
      >
        Guide
      </DocsLink>,
    );

    const link = screen.getByText('Guide').closest('a')!;
    expect(link).toHaveAttribute('rel', 'nofollow noopener noreferrer');
    expect(link).not.toHaveAttribute('target');
  });

  describe('internal navigation through the Storybook channel', () => {
    it('routes in-page anchors to the app URL of the current docs entry', () => {
      window.history.replaceState(null, '', `/iframe.html?viewMode=docs&id=${DOCS_ENTRY_ID}`);
      const { emit } = renderWithDocsChannel(<DocsLink href="#install-from-npm">Install</DocsLink>);

      const link = screen.getByText('Install').closest('a')!;
      expect(link).toHaveAttribute('href', `./?path=/docs/${DOCS_ENTRY_ID}#install-from-npm`);

      fireEvent.click(link);
      expect(emit).toHaveBeenCalledWith(NAVIGATE_URL, '#install-from-npm');
    });

    it('keeps the raw anchor when the iframe URL has no docs entry', () => {
      const { emit } = renderWithDocsChannel(
        <DocsLink href="#contribution">Contribution</DocsLink>,
      );

      const link = screen.getByText('Contribution').closest('a')!;
      expect(link).toHaveAttribute('href', '#contribution');

      fireEvent.click(link);
      expect(emit).not.toHaveBeenCalled();
    });

    it.each([
      ['an absolute /docs path', '/docs/components-icon--docs'],
      ['a bare ?path query', '?path=/docs/components-icon--docs'],
      ['a root-relative ?path query', '/?path=/docs/components-icon--docs'],
      ['the canonical ./?path form', './?path=/docs/components-icon--docs'],
    ])('routes %s through NAVIGATE_URL', (_label, href) => {
      const { emit } = renderWithDocsChannel(<DocsLink href={href}>Icon</DocsLink>);

      const link = screen.getByText('Icon').closest('a')!;
      expect(link).toHaveAttribute('href', './?path=/docs/components-icon--docs');

      fireEvent.click(link);
      expect(emit).toHaveBeenCalledWith(NAVIGATE_URL, './?path=/docs/components-icon--docs');
    });

    it('lets a caller-provided onClick prevent the internal routing', () => {
      const onClick = vi.fn((event: ReactMouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
      });
      const { emit } = renderWithDocsChannel(
        <DocsLink
          href="./?path=/docs/x--docs"
          onClick={onClick}
        >
          Guide
        </DocsLink>,
      );

      fireEvent.click(screen.getByText('Guide'));
      expect(onClick).toHaveBeenCalled();
      expect(emit).not.toHaveBeenCalled();
    });

    it('forwards the caller-provided onClick before routing internally', () => {
      const onClick = vi.fn();
      const { emit } = renderWithDocsChannel(
        <DocsLink
          href="./?path=/docs/x--docs"
          onClick={onClick}
        >
          Guide
        </DocsLink>,
      );

      fireEvent.click(screen.getByText('Guide'));
      expect(onClick).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith(NAVIGATE_URL, './?path=/docs/x--docs');
    });

    it.each([
      ['ctrl-click', { ctrlKey: true }],
      ['meta-click', { metaKey: true }],
      ['shift-click', { shiftKey: true }],
      ['alt-click', { altKey: true }],
      ['a non-primary button click', { button: 1 }],
    ])('leaves %s on internal links to the browser', (_label, init) => {
      const onClick = vi.fn();
      const { emit } = renderWithDocsChannel(
        <DocsLink
          href="./?path=/docs/x--docs"
          onClick={onClick}
        >
          Guide
        </DocsLink>,
      );

      const link = screen.getByText('Guide').closest('a')!;
      const clickEvent = createEvent.click(link, init);
      fireEvent(link, clickEvent);

      expect(onClick).toHaveBeenCalled();
      expect(clickEvent.defaultPrevented).toBe(false);
      expect(emit).not.toHaveBeenCalled();
    });

    it('leaves internal links with a non-default target to the browser', () => {
      const { emit } = renderWithDocsChannel(
        <DocsLink
          href="./?path=/docs/x--docs"
          target="_blank"
        >
          Guide
        </DocsLink>,
      );

      const link = screen.getByText('Guide').closest('a')!;
      expect(link).toHaveAttribute('target', '_blank');

      const clickEvent = createEvent.click(link);
      fireEvent(link, clickEvent);
      expect(clickEvent.defaultPrevented).toBe(false);
      expect(emit).not.toHaveBeenCalled();
    });

    it('still routes target="_self" internal links through the channel', () => {
      const { emit } = renderWithDocsChannel(
        <DocsLink
          href="./?path=/docs/x--docs"
          target="_self"
        >
          Guide
        </DocsLink>,
      );

      fireEvent.click(screen.getByText('Guide'));
      expect(emit).toHaveBeenCalledWith(NAVIGATE_URL, './?path=/docs/x--docs');
    });
  });
});
