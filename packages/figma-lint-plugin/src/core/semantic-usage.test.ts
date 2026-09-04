import { describe, expect, it } from 'vitest';
import {
  describeWrongColorUsage,
  getColorTokenCategory,
  isAllowedColorUsage,
} from './semantic-usage.ts';

describe('getColorTokenCategory', () => {
  it('maps name segments to categories', () => {
    expect(getColorTokenCategory(['color', 'background', 'elevation', 'surface'])).toBe(
      'background',
    );
    expect(getColorTokenCategory(['color', 'content', 'primary'])).toBe('content');
    expect(getColorTokenCategory(['color', 'border', 'dim1', 'default'])).toBe('border');
    expect(getColorTokenCategory(['color', 'shadow', 'md'])).toBe('shadow');
  });

  it('returns unknown for non-color roots', () => {
    expect(getColorTokenCategory(['spacing', 'sm'])).toBe('unknown');
  });

  it('returns unknown for unknown color sub-categories', () => {
    expect(getColorTokenCategory(['color', 'dataviz'])).toBe('unknown');
    expect(getColorTokenCategory(['color'])).toBe('unknown');
    expect(getColorTokenCategory([])).toBe('unknown');
  });
});

describe('isAllowedColorUsage', () => {
  it('allows background tokens on frame and shape fills, not text fills or strokes', () => {
    expect(isAllowedColorUsage('background', 'fill', 'FRAME')).toBe(true);
    expect(isAllowedColorUsage('background', 'fill', 'SHAPE')).toBe(true);
    expect(isAllowedColorUsage('background', 'fill', 'TEXT')).toBe(false);
    expect(isAllowedColorUsage('background', 'stroke', 'FRAME')).toBe(false);
    expect(isAllowedColorUsage('background', 'padding', 'FRAME')).toBe(false);
    expect(isAllowedColorUsage('background', 'gap', 'FRAME')).toBe(false);
    expect(isAllowedColorUsage('background', 'cornerRadius', 'FRAME')).toBe(false);
  });

  it('allows content tokens on text and shape fills, not frame fills or strokes', () => {
    expect(isAllowedColorUsage('content', 'fill', 'TEXT')).toBe(true);
    expect(isAllowedColorUsage('content', 'fill', 'SHAPE')).toBe(true);
    expect(isAllowedColorUsage('content', 'fill', 'FRAME')).toBe(false);
    expect(isAllowedColorUsage('content', 'stroke', 'TEXT')).toBe(false);
    expect(isAllowedColorUsage('content', 'padding', 'FRAME')).toBe(false);
  });

  it('allows border tokens on strokes only', () => {
    expect(isAllowedColorUsage('border', 'stroke', 'FRAME')).toBe(true);
    expect(isAllowedColorUsage('border', 'fill', 'FRAME')).toBe(false);
    expect(isAllowedColorUsage('border', 'fill', 'TEXT')).toBe(false);
    expect(isAllowedColorUsage('border', 'fill', 'SHAPE')).toBe(false);
  });

  it('never allows shadow tokens on checked properties', () => {
    expect(isAllowedColorUsage('shadow', 'fill', 'FRAME')).toBe(false);
    expect(isAllowedColorUsage('shadow', 'stroke', 'FRAME')).toBe(false);
  });

  it('treats unknown categories as allowed (rule stays silent)', () => {
    expect(isAllowedColorUsage('unknown', 'fill', 'FRAME')).toBe(false);
  });
});

describe('describeWrongColorUsage', () => {
  it('explains content tokens on frame fills', () => {
    expect(describeWrongColorUsage('content', 'fill', 'FRAME')).toBe(
      '`color/content` tokens are for text and icon colors — not for frame fills.',
    );
  });

  it('explains background tokens on text fills', () => {
    expect(describeWrongColorUsage('background', 'fill', 'TEXT')).toBe(
      '`color/background` tokens are for backgrounds (frame and shape fills) — not for text fills.',
    );
  });

  it('explains border tokens on fills', () => {
    expect(describeWrongColorUsage('border', 'fill', 'FRAME')).toBe(
      '`color/border` tokens are for strokes — not for frame fills.',
    );
  });

  it('explains shadow tokens anywhere', () => {
    expect(describeWrongColorUsage('shadow', 'fill', 'SHAPE')).toBe(
      '`color/shadow` tokens are for shadow effects — not for shape fills.',
    );
  });
});
