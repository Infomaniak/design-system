import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DocsMarkdown from './docs-markdown.tsx';

describe('DocsMarkdown', () => {
  it('renders external markdown links with new-tab security attributes and icon', () => {
    render(<DocsMarkdown>{'[Figma file](https://www.figma.com/design/xxx)'}</DocsMarkdown>);

    const link = screen.getByText('Figma file').closest('a')!;
    expect(link).toHaveAttribute('href', 'https://www.figma.com/design/xxx');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('esds-icon')).not.toBeNull();
  });

  it('renders internal markdown links as plain anchors', () => {
    render(<DocsMarkdown>{'[Guide](./?path=/docs/designers-guide--docs)'}</DocsMarkdown>);

    const link = screen.getByText('Guide').closest('a')!;
    expect(link).not.toHaveAttribute('target');
    expect(link.querySelector('esds-icon')).toBeNull();
  });

  it('renders plain markdown content unchanged', () => {
    render(<DocsMarkdown>{'# T1 Font Tokens\n\nSome **bold** text'}</DocsMarkdown>);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('T1 Font Tokens');
    expect(screen.getByText('bold')).toBeInTheDocument();
  });
});
