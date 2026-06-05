import { parseSVG, SVG } from '@iconify/tools';
import type { ParseSVGCallbackItem } from '@iconify/tools/lib/svg/parse';

export interface ApplyOpticalSizesOptions {
  readonly expectedSvgSize: number;
  readonly expectedStrokeWidthSize: number;
  readonly equation: string;
}

const DEFAULT_SVG_SIZE = 24;

/*
  Given a default icon size of `24`, the equation for the stroke-width would be: `(size / 32) + 1`.
  `1em` is the current size (equivalent of the `size` of the equation) => `calc((1em / 32 + 1px))`
  **But** the equation is valid only if the "width" and "height" as well as the "viewBox" of the svg, have the same value as the `size` of the equation.
  Thus, we must "scale" the stroke-width to make it match this "ratio difference" => `calc((1em / 32 + 1px) / 1em * 24)`.-
  Finally, we may simplify the equation => `calc(3/4 + (24px/1em))` => `calc((24px/1em) + 0.75)`
 */
export const DEFAULT_OPTICAL_SIZE_OPTIONS: ApplyOpticalSizesOptions = {
  expectedSvgSize: DEFAULT_SVG_SIZE,
  expectedStrokeWidthSize: 1.75,
  equation: `calc((${DEFAULT_SVG_SIZE}px/1em) + 0.75)`,
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
