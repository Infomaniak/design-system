import { parseSVG, SVG } from '@iconify/tools';
import type { ParseSVGCallbackItem } from '@iconify/tools/lib/svg/parse';

export interface ApplyOpticalSizesOptions {
  readonly expectedStrokeWidthSize: number;
  readonly equation: string;
}

/*
  The equation for the stroke-width would be: `(size / 32) + 1`.
  `1em` is the current size (equivalent of the `size` of the equation) => `calc((1em / 32) + 1px)`

  By adding `vector-effect="non-scaling-stroke"`, the stroke width stays consistent
  regardless of the SVG's viewBox or the container size.
 */
export const DEFAULT_OPTICAL_SIZE_OPTIONS: ApplyOpticalSizesOptions = {
  expectedStrokeWidthSize: 1.75,
  equation: `calc((1em / 32) + 1px)`,
};

export function applyOpticalSizes(
  svg: SVG,
  { expectedStrokeWidthSize, equation }: ApplyOpticalSizesOptions = DEFAULT_OPTICAL_SIZE_OPTIONS,
): void {
  parseSVG(svg, (item: ParseSVGCallbackItem): void => {
    const node = item.node;
    if (Reflect.has(node.attribs, 'stroke-width')) {
      let strokeWidth: string | number = Reflect.get(node.attribs, 'stroke-width');

      if (typeof strokeWidth === 'string') {
        strokeWidth = Number(strokeWidth);

        if (Number.isNaN(strokeWidth)) {
          throw new Error(`Expected "number" as stroke-width, got "${strokeWidth}".`);
        }
      }

      if (strokeWidth !== expectedStrokeWidthSize) {
        throw new Error(
          `Expected "${expectedStrokeWidthSize}" as stroke-width, got "${strokeWidth}".`,
        );
      }

      Reflect.set(node.attribs, 'stroke-width', equation);
      Reflect.set(node.attribs, 'vector-effect', 'non-scaling-stroke');
    }
  });
}
