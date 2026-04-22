import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CopyableText from './CopyableText.tsx';

describe('CopyableText', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it('renders value', () => {
    render(<CopyableText value="home" />);
    expect(screen.getByRole('button', { name: /copy home to clipboard/i })).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <CopyableText
        value="home"
        label="Icon name"
      />,
    );
    expect(screen.getByText('Icon name:')).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('renders children instead of value when provided', () => {
    render(
      <CopyableText value="internal-value">
        <span data-testid="custom-child">Custom Content</span>
      </CopyableText>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('uses monospace font for the button', () => {
    render(<CopyableText value="home" />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('font-family: ui-monospace, monospace');
  });

  it('copies value to clipboard when clicked', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(<CopyableText value="home" />);

    const button = screen.getByRole('button', { name: /copy home to clipboard/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('home');
    });
  });

  it('shows copied feedback after successful copy', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(<CopyableText value="home" />);

    const button = screen.getByRole('button', { name: /copy home to clipboard/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('handles copy failure gracefully', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Failed'));
    render(<CopyableText value="home" />);

    const button = screen.getByRole('button', { name: /copy home to clipboard/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to copy')).toBeInTheDocument();
    });
  });

  it('hides tooltip after delay', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(<CopyableText value="home" />);

    const button = screen.getByRole('button', { name: /copy home to clipboard/i });
    fireEvent.click(button);

    // Verify tooltip is shown
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    // Wait for the hide delay (1500ms) plus a small buffer
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // Tooltip should be hidden (element still in DOM but with opacity 0 via class)
    const tooltip = screen.getByRole('status');
    expect(tooltip).not.toHaveClass('copyable-text__tooltip--visible');
  });

  it('shows copy to clipboard tooltip on hover', async () => {
    render(<CopyableText value="home" />);

    const button = screen.getByRole('button', { name: /copy home to clipboard/i });
    fireEvent.mouseEnter(button);

    // Tooltip should show "Copy to clipboard"
    await waitFor(() => {
      expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();
    });

    // Tooltip should be visible
    const tooltip = screen.getByRole('status');
    expect(tooltip).toHaveClass('copyable-text__tooltip--visible');

    // Mouse leave should hide tooltip
    fireEvent.mouseLeave(button);
    expect(tooltip).not.toHaveClass('copyable-text__tooltip--visible');
  });
});
