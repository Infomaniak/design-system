import { SVG } from '@iconify/tools';
import { describe, expect, it } from 'vitest';
import{
  applyOpticalSizes,
  DEFAULT_OPTICAL_SIZE_OPTIONS,
  type ApplyOpticalSizesOptions,
}from './apply-optical-sizes.ts';

describe('applyOpticalSizes', () => {
  const createSvg = (content: string): SVG => {
    return new SVG(content);
  };

  it('replaces stroke-width with the equation and adds vector-effect', () => {
    const svg = createSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.75" d="M0 0 L10 10"/></svg>`,
    );

    applyOpticalSizes(svg);

    expect(svg.toMinifiedString()).toContain(
      `stroke-width="${DEFAULT_OPTICAL_SIZE_OPTIONS.equation}"`,
    );
    expect(svg.toMinifiedString()).toContain(`vector-effect="non-scaling-stroke"`);
  });

  it('does not throw if viewBox and dimensions differ from a fixed size', () => {
    const svg = createSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path fill="none" stroke="currentColor" stroke-width="1.75" d="M0 0 L10 10"/></svg>`,
    );

    expect(() => applyOpticalSizes(svg)).not.toThrow();
  });

  it('throws if stroke-width is not the expected size', () => {
    const svg = createSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M0 0 L10 10"/></svg>`,
    );

    expect(() => applyOpticalSizes(svg)).toThrowError(
      /Expected \"1.75\" as stroke-width/,
    );
  });

  it('does not modify nodes without stroke-width', () => {
    const svg = createSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
    );
    const original = svg.toMinifiedString();

    applyOpticalSizes(svg);

    expect(svg.toMinifiedString()).toBe(original);
  });

  it('uses custom options when provided', () => {
    const customOptions: ApplyOpticalSizesOptions = {
      expectedStrokeWidthSize: 2,
      equation: 'calc((1em / 20) + 1px)',
    };
    const svg = createSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M0 0 L10 10"/></svg>`,
    );

    applyOpticalSizes(svg, customOptions);

    expect(svg.toMinifiedString()).toContain(`stroke-width="${customOptions.equation}"`);
    expect(svg.toMinifiedString()).toContain(`vector-effect="non-scaling-stroke"`);
  });

  it('applies to all nodes with stroke-width', () => {
    const svg = createSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.75" d="M0 0 L10 10"/><line stroke="currentColor" stroke-width="1.75" x1="0" y1="0" x2="10" y2="10"/></svg>`,
    );

    applyOpticalSizes(svg);

    const minified = svg.toMinifiedString();
    const matches = minified.match(/stroke-width="calc\(\(1em \/ 32\) \+ 1px\)"/g);
    expect(matches?.length).toBe(2);
  });
});
