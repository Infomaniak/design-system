import { describe, expect, it } from 'vitest';

import {
  CANVAS_SIZE,
  DEFAULT_STROKE_WEIGHTS,
  ICON_COLORS,
  ICON_SIZES,
  isCanvasSize,
  isIconSize,
} from './tokens.ts';

describe('tokens', () => {
  it('exposes the five icon sizes in ascending order', () => {
    expect(ICON_SIZES).toEqual([16, 20, 24, 32, 40]);
  });

  it('uses 24px as the canvas size', () => {
    expect(CANVAS_SIZE).toBe(24);
  });

  it('defines stroke weights for every icon size', () => {
    for (const size of ICON_SIZES) {
      expect(typeof DEFAULT_STROKE_WEIGHTS[size]).toBe('number');
    }
  });

  it('defines black and disabled colors', () => {
    expect(ICON_COLORS.default).toEqual({ r: 0, g: 0, b: 0 });
    expect(ICON_COLORS.disabled).toEqual({ r: 0.5, g: 0.5, b: 0.5 });
  });
});

describe('isIconSize', () => {
  it.each([16, 20, 24, 32, 40])('accepts %i', (size) => {
    expect(isIconSize(size)).toBe(true);
  });

  it('rejects unknown sizes and non-numbers', () => {
    expect(isIconSize(18)).toBe(false);
    expect(isIconSize('16')).toBe(false);
    expect(isIconSize(null)).toBe(false);
  });
});

describe('isCanvasSize', () => {
  it('accepts exact 24x24 nodes', () => {
    expect(isCanvasSize({ width: 24, height: 24 })).toBe(true);
  });

  it('accepts nodes within the tolerance', () => {
    expect(isCanvasSize({ width: 23.95, height: 24.05 })).toBe(true);
  });

  it('rejects undersized nodes', () => {
    expect(isCanvasSize({ width: 16, height: 16 })).toBe(false);
  });

  it('rejects nodes with only one matching dimension', () => {
    expect(isCanvasSize({ width: 24, height: 32 })).toBe(false);
  });
});
