import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TONES,
  formatPalette,
  generateTonalPalette,
  isDark,
  normalizeHex,
  parseTones,
} from './hct-palette.ts';

describe('normalizeHex', () => {
  it('trims, adds the leading # and uppercases', () => {
    expect(normalizeHex('  6750a4 ')).toBe('#6750A4');
    expect(normalizeHex('##abcdef')).toBe('#ABCDEF');
  });

  it.each(['#FFF', '#GGGGGG', '#1234567', ''])('rejects %j', (value: string) => {
    expect(() => normalizeHex(value)).toThrow('Use a 6-digit hex color, e.g. #888888');
  });
});

describe('isDark', () => {
  it('uses the perceived luminance of the color', () => {
    expect(isDark('#000000')).toBe(true);
    expect(isDark('#7F7F7F')).toBe(true);
    expect(isDark('#818181')).toBe(false);
    expect(isDark('#FFFF00')).toBe(false);
  });
});

describe('parseTones', () => {
  it('parses a comma separated list and ignores empty parts', () => {
    expect(parseTones(' 0, 50 ,,100, ')).toEqual([0, 50, 100]);
  });

  it('rejects non-integer tones', () => {
    expect(() => parseTones('10, 1.5')).toThrow('Invalid tone "1.5"');
  });

  it.each(['-1', '101'])('rejects out of range tone %s', (value: string) => {
    expect(() => parseTones(value)).toThrow('Tones must be between 0 and 100');
  });

  it('rejects an empty list', () => {
    expect(() => parseTones(' , ')).toThrow('Add at least one tone');
  });
});

describe('generateTonalPalette', () => {
  // Reference values generated with PyMCUlib (Python port of Material Color Utilities).
  it('matches PyMCUlib for the default tones', () => {
    expect(generateTonalPalette('#6750a4', DEFAULT_TONES).map(({ hex }) => hex)).toEqual([
      '#000000',
      '#160041',
      '#22005D',
      '#2D1067',
      '#381E72',
      '#432B7E',
      '#4F378A',
      '#5B4397',
      '#6750A4',
      '#735CB1',
      '#8069BF',
      '#9A83DB',
      '#B69DF7',
      '#CFBCFF',
      '#E9DDFF',
      '#F6EEFF',
      '#FDF7FF',
      '#FFFBFF',
      '#FFFFFF',
    ]);
  });

  it('keeps the requested tones order', () => {
    expect(generateTonalPalette('E91E63', [60, 10])).toEqual([
      { tone: 60, hex: '#FF4E7C' },
      { tone: 10, hex: '#400014' },
    ]);
  });
});

describe('formatPalette', () => {
  it('right-aligns tones like the original tool', () => {
    expect(
      formatPalette([
        { tone: 0, hex: '#000000' },
        { tone: 100, hex: '#FFFFFF' },
      ]),
    ).toBe('  0  #000000\n100  #FFFFFF');
  });
});
