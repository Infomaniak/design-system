import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import IconSizeSlider from './IconSizeSlider.tsx';

describe('IconSizeSlider', () => {
  it('renders with default range 16-96 and step 2', () => {
    render(
      <IconSizeSlider
        value={48}
        onChange={vi.fn()}
      />,
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '16');
    expect(slider).toHaveAttribute('max', '96');
    expect(slider).toHaveAttribute('step', '2');
  });

  it('renders with custom min, max, and step', () => {
    render(
      <IconSizeSlider
        value={50}
        onChange={vi.fn()}
        min={20}
        max={100}
        step={5}
      />,
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '20');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '5');
  });

  it('displays the current value label', () => {
    render(
      <IconSizeSlider
        value={48}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('48px')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(
      <IconSizeSlider
        value={48}
        onChange={handleChange}
      />,
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '64' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(64);
  });

  it('has accessible aria-label', () => {
    render(
      <IconSizeSlider
        value={48}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('slider')).toHaveAttribute('aria-label', 'Icon size');
  });

  it('renders disabled when disabled prop is true', () => {
    render(
      <IconSizeSlider
        value={48}
        onChange={vi.fn()}
        disabled
      />,
    );

    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
