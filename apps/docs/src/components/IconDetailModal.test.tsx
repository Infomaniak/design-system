import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import IconDetailModal from './IconDetailModal.tsx';

describe('IconDetailModal', () => {
  const mockOnClose = vi.fn();
  const mockIcon = {
    name: 'home',
    categories: new Set(['buildings', 'navigation']),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Create portal root
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    vi.useRealTimers();
    const portalRoot = document.getElementById('modal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={false}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays icon name', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    // Icon name appears in both h2 and CopyField, so we use getAllByText
    const elements = screen.getAllByText('material-symbols:home');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('displays esds-svg code snippet', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(screen.getByText('<esds-svg name="material-symbols:home" />')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unlocks body scroll when closed', () => {
    const { rerender } = render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <IconDetailModal
        icon={mockIcon}
        isOpen={false}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('renders nothing when icon is null', () => {
    render(
      <IconDetailModal
        icon={null}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
