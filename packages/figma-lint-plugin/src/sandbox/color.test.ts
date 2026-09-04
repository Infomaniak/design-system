import { describe, expect, it } from 'vitest';
import { figmaRgbaToHex } from './color.ts';

describe('figmaRgbaToHex', () => {
  it('formats 0..1 float channels as uppercase hex', () => {
    expect(figmaRgbaToHex({ r: 74 / 255, g: 144 / 255, b: 217 / 255, a: 1 })).toBe('#4A90D9');
  });

  it('formats black and white', () => {
    expect(figmaRgbaToHex({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
    expect(figmaRgbaToHex({ r: 1, g: 1, b: 1, a: 1 })).toBe('#FFFFFF');
  });

  it('clamps out-of-range channels', () => {
    expect(figmaRgbaToHex({ r: -1, g: 2, b: 0.5, a: 1 })).toBe('#00FF80');
  });
});
