import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { IconItem } from '../hooks/useIconGallery.ts';
import IconCard from './IconCard.tsx';

describe('IconCard', () => {
  const mockIcon: IconItem = {
    name: 'home',
    categories: new Set(['navigation']),
  };

  it('renders icon name', () => {
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
      />,
    );
    expect(screen.getByText('material-symbols:home')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
        onClick={mockOnClick}
      />,
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockIcon);
  });

  it('calls onClick when Enter key is pressed', () => {
    const mockOnClick = vi.fn();
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
        onClick={mockOnClick}
      />,
    );

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const mockOnClick = vi.fn();
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
        onClick={mockOnClick}
      />,
    );

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard accessible', () => {
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
      />,
    );
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
