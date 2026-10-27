import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HctPaletteGenerator from './HctPaletteGenerator.tsx';

function getEntries(): string[] {
  return within(screen.getByRole('list', { name: 'Tonal palette' }))
    .getAllByRole('listitem')
    .map((item: HTMLElement) => item.textContent ?? '');
}

describe('HctPaletteGenerator', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders the default palette of #6750A4', () => {
    render(<HctPaletteGenerator />);

    const entries: string[] = getEntries();
    expect(entries).toHaveLength(19);
    expect(entries[0]).toBe('  0  #000000');
    expect(entries[8]).toBe(' 40  #6750A4');
  });

  it('regenerates the palette live from the source and tones inputs', () => {
    render(<HctPaletteGenerator />);

    fireEvent.change(screen.getByLabelText('Base color (source HEX)'), {
      target: { value: 'e91e63' },
    });
    fireEvent.change(screen.getByLabelText('Tones (comma separated)'), {
      target: { value: '10, 60' },
    });

    expect(getEntries()).toEqual([' 10  #400014', ' 60  #FF4E7C']);
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

  it('applies the output background and a contrasting text color', () => {
    render(<HctPaletteGenerator />);
    const output = screen.getByRole('list', { name: 'Tonal palette' });
    const backgroundInput = screen.getByLabelText('Output background');

    expect(output).toHaveStyle({ background: '#888888', color: '#000000' });

    fireEvent.change(screen.getByLabelText('Pick output background'), {
      target: { value: '#111111' },
    });
    expect(output).toHaveStyle({ background: '#111111', color: '#FFFFFF' });

    fireEvent.change(backgroundInput, { target: { value: 'ffffff' } });
    fireEvent.blur(backgroundInput);
    expect(backgroundInput).toHaveValue('#FFFFFF');

    fireEvent.change(backgroundInput, { target: { value: 'nope' } });
    fireEvent.blur(backgroundInput);
    expect(backgroundInput).toHaveValue('nope');
    expect(screen.getByLabelText('Pick output background')).toHaveValue('#888888');
    expect(screen.getByRole('alert')).toHaveTextContent('Use a 6-digit hex color');
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

    act(() => vi.advanceTimersByTime(1500));
    expect(button).toHaveTextContent('Copy output');
  });

  it('reports a clipboard failure', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) },
    });
    const { unmount } = render(<HctPaletteGenerator />);

    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy output' })));

    expect(screen.getByRole('button', { name: 'Failed to copy' })).toBeInTheDocument();
    unmount();
  });
});
