import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { IconItem } from '../hooks/useIconGallery.ts';
import IconGrid from './IconGrid.tsx';

describe('IconGrid', () => {
  const mockIcons: IconItem[] = [
    { name: 'home', categories: new Set(['navigation']) },
    { name: 'settings', categories: new Set(['action']) },
    { name: 'user', categories: new Set(['user']) },
  ];

  beforeEach(() => {
    // Create portal root for modal
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    document.body.appendChild(portalRoot);
  });

  it('renders all icon cards', () => {
    render(
      <IconGrid
        icons={mockIcons}
        prefix="material-symbols"
      />,
    );

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('opens modal when icon card is clicked', () => {
    render(
      <IconGrid
        icons={mockIcons}
        prefix="material-symbols"
      />,
    );

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays correct icon details in modal', () => {
    render(
      <IconGrid
        icons={mockIcons}
        prefix="material-symbols"
      />,
    );

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(
      screen.getByRole('button', { name: 'Copy material-symbols:home to clipboard' }),
    ).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    render(
      <IconGrid
        icons={mockIcons}
        prefix="material-symbols"
      />,
    );

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('returns null when no icons', () => {
    const { container } = render(
      <IconGrid
        icons={[]}
        prefix="material-symbols"
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
