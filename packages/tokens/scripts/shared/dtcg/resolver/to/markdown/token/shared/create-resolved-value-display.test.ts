import { describe, expect, it } from 'vitest';
import { createResolvedValueDisplay } from './create-resolved-value-display.ts';

describe('createResolvedValueDisplay', () => {
  it('returns a div with unified styling containing the value', () => {
    const result = createResolvedValueDisplay('42px');

    expect(result).toContain('42px');
    expect(result).toContain('margin-top: 4px');
    expect(result).toContain('font-size: 12px');
    expect(result).toContain('font-family: monospace');
    expect(result).toContain('color: #6b7280');
    expect(result).toContain('min-height: 18px');
  });

  it('adds data-preview-value and empty content for runtime JS resolution', () => {
    const result = createResolvedValueDisplay('--esds-color-red-500', {
      dataPreviewValue: '--esds-color-red-500',
    });

    expect(result).toContain('data-preview-value="--esds-color-red-500"');
    expect(result).toContain('min-height: 18px');
    // Content between > and </div> should be empty
    expect(result).toMatch(/>\s*<\/div>/);
  });
});
