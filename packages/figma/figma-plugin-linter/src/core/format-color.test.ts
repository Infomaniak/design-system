import { describe, expect, it } from 'vitest';
import { rgbaToHex } from './format-color.ts';

describe('rgbaToHex', () => {
  it('formats channels as an uppercase hex string', () => {
    expect(rgbaToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbaToHex({ r: 1, g: 1, b: 1 })).toBe('#FFFFFF');
    expect(rgbaToHex({ r: 74 / 255, g: 144 / 255, b: 217 / 255 })).toBe('#4A90D9');
  });

  it('clamps out-of-range channels and rounds', () => {
    expect(rgbaToHex({ r: -1, g: 2, b: 0.5 })).toBe('#00FF80');
    expect(rgbaToHex({ r: 0.502, g: 0, b: 0 })).toBe('#800000');
  });

  it('ignores alpha', () => {
    expect(rgbaToHex({ r: 1, g: 0, b: 0 })).toBe('#FF0000');
  });
});
