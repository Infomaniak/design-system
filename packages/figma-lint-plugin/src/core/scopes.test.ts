import { describe, expect, it } from 'vitest';
import { describeRequiredProperty, getRequiredScopes, scopesCoverProperty } from './scopes.ts';

describe('getRequiredScopes', () => {
  it('requires FRAME_FILL for fills on frames and instances', () => {
    expect(getRequiredScopes('fill', 'FRAME')).toEqual(['FRAME_FILL']);
    expect(getRequiredScopes('fill', 'INSTANCE')).toEqual(['FRAME_FILL']);
  });

  it('requires TEXT_FILL for fills on text nodes', () => {
    expect(getRequiredScopes('fill', 'TEXT')).toEqual(['TEXT_FILL']);
  });

  it('requires SHAPE_FILL for fills on shapes', () => {
    expect(getRequiredScopes('fill', 'SHAPE')).toEqual(['SHAPE_FILL']);
    expect(getRequiredScopes('fill', 'GROUP')).toEqual(['SHAPE_FILL']);
  });

  it('requires STROKE_COLOR for strokes regardless of node type', () => {
    expect(getRequiredScopes('stroke', 'FRAME')).toEqual(['STROKE_COLOR']);
    expect(getRequiredScopes('stroke', 'TEXT')).toEqual(['STROKE_COLOR']);
  });

  it('requires GAP for padding and gap (Figma has no PADDING scope)', () => {
    expect(getRequiredScopes('padding', 'FRAME')).toEqual(['GAP']);
    expect(getRequiredScopes('gap', 'FRAME')).toEqual(['GAP']);
  });

  it('requires CORNER_RADIUS for corner radius', () => {
    expect(getRequiredScopes('cornerRadius', 'SHAPE')).toEqual(['CORNER_RADIUS']);
  });
});

describe('describeRequiredProperty', () => {
  it('returns human-readable targets', () => {
    expect(describeRequiredProperty('fill', 'FRAME')).toBe('frame fills');
    expect(describeRequiredProperty('fill', 'INSTANCE')).toBe('frame fills');
    expect(describeRequiredProperty('fill', 'TEXT')).toBe('text fills');
    expect(describeRequiredProperty('fill', 'SHAPE')).toBe('shape fills');
    expect(describeRequiredProperty('stroke', 'SHAPE')).toBe('strokes');
    expect(describeRequiredProperty('padding', 'FRAME')).toBe('padding');
    expect(describeRequiredProperty('gap', 'FRAME')).toBe('gap');
    expect(describeRequiredProperty('cornerRadius', 'SHAPE')).toBe('corner radius');
  });
});

describe('scopesCoverProperty', () => {
  it('allows scope-free variables everywhere', () => {
    expect(scopesCoverProperty([], ['FRAME_FILL'])).toBe(true);
  });

  it('allows ALL_SCOPES everywhere', () => {
    expect(scopesCoverProperty(['ALL_SCOPES'], ['CORNER_RADIUS'])).toBe(true);
  });

  it('allows a direct required scope', () => {
    expect(scopesCoverProperty(['GAP'], ['GAP'])).toBe(true);
  });

  it('rejects scopes that miss the required scope', () => {
    expect(scopesCoverProperty(['STROKE_COLOR'], ['FRAME_FILL'])).toBe(false);
  });

  it('lets ALL_FILLS cover any fill target', () => {
    expect(scopesCoverProperty(['ALL_FILLS'], ['FRAME_FILL'])).toBe(true);
    expect(scopesCoverProperty(['ALL_FILLS'], ['SHAPE_FILL'])).toBe(true);
    expect(scopesCoverProperty(['ALL_FILLS'], ['TEXT_FILL'])).toBe(true);
  });

  it('does not let ALL_FILLS cover non-fill properties', () => {
    expect(scopesCoverProperty(['ALL_FILLS'], ['STROKE_COLOR'])).toBe(false);
    expect(scopesCoverProperty(['ALL_FILLS'], ['GAP'])).toBe(false);
    expect(scopesCoverProperty(['ALL_FILLS'], ['CORNER_RADIUS'])).toBe(false);
  });

  it('passes when any of several scopes matches', () => {
    expect(scopesCoverProperty(['STROKE_COLOR', 'FRAME_FILL'], ['FRAME_FILL'])).toBe(true);
    expect(scopesCoverProperty(['STROKE_COLOR', 'GAP'], ['CORNER_RADIUS'])).toBe(false);
  });
});
