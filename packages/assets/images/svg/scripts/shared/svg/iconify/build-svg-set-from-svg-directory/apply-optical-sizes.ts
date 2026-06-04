import { parseSVG, SVG } from '@iconify/tools';
import type { ParseSVGCallbackItem } from '@iconify/tools/lib/svg/parse';

export interface ApplyOpticalSizesOptions {
  readonly expectedSvgSize: number;
  readonly expectedStrokeWidthSize: number;
  readonly equation: string;
}

const DEFAULT_SVG_SIZE = 24;

/*
Given a default icon size of `24`, the equation for the stroke-width would be:
  => (width / 32) + 1
  => calc((1em / 32 + 1px) / 1em * 24)
  => calc(3/4 + (24px/1em))
 */
export const DEFAULT_OPTICAL_SIZE_OPTIONS: ApplyOpticalSizesOptions = {
  expectedSvgSize: DEFAULT_SVG_SIZE,
  expectedStrokeWidthSize: 1.75,
  equation: `calc(3/4 + (${DEFAULT_SVG_SIZE}px/1em))`,
};

export function applyOpticalSizes(
  svg: SVG,
  {
    expectedSvgSize,
    expectedStrokeWidthSize,
    equation,
  }: ApplyOpticalSizesOptions = DEFAULT_OPTICAL_SIZE_OPTIONS,
): void {
  if (svg.viewBox.left !== 0) {
    throw new Error(`Expected "0" as viewBox left.`);
  }

  if (svg.viewBox.top !== 0) {
    throw new Error(`Expected "0" as viewBox top.`);
  }

  if (svg.viewBox.width !== expectedSvgSize) {
    throw new Error(`Expected "${expectedSvgSize}" as viewBox width.`);
  }

  if (svg.viewBox.height !== expectedSvgSize) {
    throw new Error(`Expected "${expectedSvgSize}" as viewBox height.`);
  }

  if (Number(svg.$svg.attribs['width']) !== expectedSvgSize) {
    throw new Error(`Expected "${expectedSvgSize}" as svg width.`);
  }

  if (Number(svg.$svg.attribs['height']) !== expectedSvgSize) {
    throw new Error(`Expected "${expectedSvgSize}" as svg height.`);
  }

  parseSVG(svg, (item: ParseSVGCallbackItem): void => {
    const node = item.node;
    if (Reflect.has(node.attribs, 'stroke-width')) {
      let strokeWidth: string | number = Reflect.get(node.attribs, 'stroke-width');

      if (typeof strokeWidth === 'string') {
        strokeWidth = Number(strokeWidth);

        if (Number.isNaN(strokeWidth)) {
          throw new Error('Expected "number" as stroke-width.');
        }
      }

      if (strokeWidth !== expectedStrokeWidthSize) {
        throw new Error(`Expected "${expectedStrokeWidthSize}" as stroke-width.`);
      }

      Reflect.set(node.attribs, 'stroke-width', equation);
    }
  });
}
