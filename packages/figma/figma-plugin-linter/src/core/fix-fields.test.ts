import { describe, expect, it } from 'vitest';
import { resolveFixFields } from './fix-fields.ts';

describe('resolveFixFields', () => {
  it('expands uniform padding and corner parts to all sides', () => {
    expect(resolveFixFields('padding', 'uniform')).toEqual([
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
    ]);
    expect(resolveFixFields('cornerRadius', 'uniform')).toEqual([
      'topLeftRadius',
      'topRightRadius',
      'bottomLeftRadius',
      'bottomRightRadius',
    ]);
  });

  it('maps per-side parts to their own field', () => {
    expect(resolveFixFields('padding', 'paddingLeft')).toEqual(['paddingLeft']);
    expect(resolveFixFields('padding', 'paddingTop')).toEqual(['paddingTop']);
    expect(resolveFixFields('cornerRadius', 'bottomLeftRadius')).toEqual(['bottomLeftRadius']);
  });

  it('maps gap and stroke weight to their Figma fields', () => {
    expect(resolveFixFields('gap', 'uniform')).toEqual(['itemSpacing']);
    expect(resolveFixFields('strokeWeight', 'uniform')).toEqual(['strokeWeight']);
  });

  it('returns undefined for paint properties and unknown part ids', () => {
    expect(resolveFixFields('fill', 'paint:0')).toBeUndefined();
    expect(resolveFixFields('stroke', 'paint:1')).toBeUndefined();
    expect(resolveFixFields('padding', 'nonsense')).toBeUndefined();
    expect(resolveFixFields('cornerRadius', 'paint:0')).toBeUndefined();
    expect(resolveFixFields('effect', 'uniform')).toBeUndefined();
    expect(resolveFixFields('opacity', 'uniform')).toBeUndefined();
  });
});
