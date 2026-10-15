import { SVG } from '@iconify/tools';
import { describe, expect, test } from 'vitest';
import {
  applyAndroidOpticalSize,
  computeAndroidOpticalStrokeWidth,
} from './apply-android-optical-size.ts';

describe('computeAndroidOpticalStrokeWidth', () => {
  test.each([
    [16, 2.25],
    [20, 1.95],
    [24, 1.75],
    [32, 1.5],
    [40, 1.35],
  ])('renders the web optical stroke width at %ipx', (iconSize: number, expected: number) => {
    expect(computeAndroidOpticalStrokeWidth(iconSize)).toBe(expected);
  });
});

describe('applyAndroidOpticalSize', () => {
  test('replaces the stroke width with the optical stroke width of the icon size', () => {
    const svg: SVG = new SVG(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke="#000" stroke-width="1.75" d="M12 9v4"/></svg>',
    );

    applyAndroidOpticalSize(svg, 32);

    expect(svg.toMinifiedString()).toContain('stroke-width="1.5"');
  });
});
