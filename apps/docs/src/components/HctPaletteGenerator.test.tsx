import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HctPaletteGenerator from './HctPaletteGenerator.tsx';

function getTiles(): HTMLElement[] {
  return within(screen.getByRole('list', { name: 'Tonal palette' })).getAllByRole('button');
}

function getTileLabels(): string[] {
  return getTiles().map((tile: HTMLElement) => tile.getAttribute('aria-label') ?? '');
}

describe('HctPaletteGenerator', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders the default palette of #6750A4', () => {
    render(<HctPaletteGenerator />);

    const labels: string[] = getTileLabels();
    expect(labels).toHaveLength(19);
    expect(labels[0]).toBe('Copy tone 0 (#000000)');
    expect(labels[8]).toBe('Copy tone 40 (#6750A4)');
    expect(getTiles()[8]).toHaveTextContent('40#6750A4');
  });

  it('regenerates the palette live from the source and tones inputs', () => {
    render(<HctPaletteGenerator />);

    fireEvent.change(screen.getByLabelText('Base color (source HEX)'), {
      target: { value: 'e91e63' },
    });
    fireEvent.change(screen.getByLabelText('Tones (comma separated)'), {
      target: { value: '10, 60' },
    });

    expect(getTileLabels()).toEqual(['Copy tone 10 (#400014)', 'Copy tone 60 (#FF4E7C)']);
  });

  it('syncs the text input with the color picker and normalizes on blur', () => {
    render(<HctPaletteGenerator />);
    const sourceInput = screen.getByLabelText('Base color (source HEX)');
    const sourcePicker = screen.getByLabelText('Pick base color');

    fireEvent.change(sourcePicker, { target: { value: '#e91e63' } });
    expect(sourceInput).toHaveValue('#E91E63');

    fireEvent.change(sourceInput, { target: { value: '0098ff' } });
    fireEvent.blur(sourceInput);
    expect(sourceInput).toHaveValue('#0098FF');
    expect(sourcePicker).toHaveValue('#0098ff');
  });

  it('renders swatches on the output background with a contrasting text color', () => {
    render(<HctPaletteGenerator />);
    const output = screen.getByRole('list', { name: 'Tonal palette' });
    const backgroundInput = screen.getByLabelText('Output background');

    expect(output).toHaveStyle({ background: '#D1D1D1', color: '#000000' });
    expect(getTiles()[8].firstElementChild).toHaveStyle({ background: '#6750A4' });

    fireEvent.change(screen.getByLabelText('Pick output background'), {
      target: { value: '#111111' },
    });
    expect(output).toHaveStyle({ background: '#111111', color: '#FFFFFF' });

    fireEvent.change(backgroundInput, { target: { value: 'ffffff' } });
    fireEvent.blur(backgroundInput);
    expect(backgroundInput).toHaveValue('#FFFFFF');

    expect(backgroundInput).not.toHaveAttribute('aria-describedby');
  });

  it('keeps the palette on the last valid background while the background is invalid', () => {
    render(<HctPaletteGenerator />);
    const backgroundInput = screen.getByLabelText('Output background');

    fireEvent.change(backgroundInput, { target: { value: '#222222' } });
    fireEvent.change(backgroundInput, { target: { value: 'nope' } });
    fireEvent.blur(backgroundInput);

    expect(backgroundInput).toHaveValue('nope');
    expect(backgroundInput).toHaveAttribute('aria-invalid', 'true');
    expect(backgroundInput).toHaveAccessibleDescription(
      'Use a 6-digit hex color. The preview keeps the last valid background (#222222).',
    );
    expect(screen.getByLabelText('Pick output background')).toHaveValue('#222222');
    expect(screen.getByRole('list', { name: 'Tonal palette' })).toHaveStyle({
      background: '#222222',
      color: '#FFFFFF',
    });
    expect(getTiles()).toHaveLength(19);
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('spaces the swatches with the spacing slider', () => {
    render(<HctPaletteGenerator />);
    const output = screen.getByRole('list', { name: 'Tonal palette' });

    expect(output).toHaveStyle({ gap: '0px' });
    expect(output).not.toHaveClass('hct-palette__output--spaced');

    fireEvent.change(screen.getByLabelText('Spacing'), { target: { value: '8' } });

    expect(output).toHaveStyle({ gap: '8px' });
    expect(output).toHaveClass('hct-palette__output--spaced');
    expect(screen.getByText('8px')).toBeInTheDocument();
  });

  it('shows an error and disables copy while an input is invalid', () => {
    render(<HctPaletteGenerator />);
    const sourceInput = screen.getByLabelText('Base color (source HEX)');

    fireEvent.change(sourceInput, { target: { value: '#12' } });
    fireEvent.blur(sourceInput);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Error: Use a 6-digit hex color, e.g. #888888',
    );
    expect(sourceInput).toHaveValue('#12');
    expect(screen.getByLabelText('Pick base color')).toHaveValue('#000000');
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeDisabled();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('copies the formatted palette and resets the feedback', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<HctPaletteGenerator />);
    fireEvent.change(screen.getByLabelText('Tones (comma separated)'), {
      target: { value: '0, 100' },
    });

    const button = screen.getByRole('button', { name: 'Copy output' });
    await act(async () => fireEvent.click(button));
    await act(async () => fireEvent.click(button));

    expect(writeText).toHaveBeenCalledWith('  0  #000000\n100  #FFFFFF');
    expect(button).toHaveTextContent('Copied!');
    expect(screen.getByRole('status')).toHaveTextContent('Copied palette');

    act(() => vi.advanceTimersByTime(1500));
    expect(button).toHaveTextContent('Copy output');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('copies a single tone when its tile is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<HctPaletteGenerator />);

    const tile: HTMLElement = screen.getByRole('button', { name: 'Copy tone 40 (#6750A4)' });
    await act(async () => fireEvent.click(tile));

    expect(writeText).toHaveBeenCalledWith('#6750A4');
    expect(tile).toHaveTextContent('40Copied!');
    expect(screen.getByRole('status')).toHaveTextContent('Copied tone 40 (#6750A4)');
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy tone 0 (#000000)' })).toHaveTextContent(
      '0#000000',
    );
  });

  it('reports a clipboard failure', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) },
    });
    const { unmount } = render(<HctPaletteGenerator />);

    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy output' })));

    expect(screen.getByRole('button', { name: 'Failed to copy' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Failed to copy palette');
    unmount();
  });
});
