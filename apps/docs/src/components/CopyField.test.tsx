import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CopyField from './CopyField.tsx';

describe('CopyField', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it('renders label and value', () => {
    render(
      <CopyField
        label="Icon Name"
        value="home"
      />,
    );
    expect(screen.getByText('Icon Name:')).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('uses monospace font when monospace prop is true', () => {
    render(
      <CopyField
        label="Code"
        value="<esds-svg />"
        monospace
      />,
    );
    const valueElement = screen.getByText('<esds-svg />');
    expect(valueElement).toHaveStyle('font-family: monospace');
  });

  it('copies value to clipboard when copy button is clicked', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(
      <CopyField
        label="Name"
        value="home"
      />,
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('home');
    });
  });

  it('shows copied feedback after successful copy', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(
      <CopyField
        label="Name"
        value="home"
      />,
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('handles copy failure gracefully', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Failed'));
    render(
      <CopyField
        label="Name"
        value="home"
      />,
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });
});
