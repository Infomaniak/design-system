import type { FigmaGradiantPaint } from './types/gradiant/figma-gradiant-paint.ts';
import type { FigmaImageLikePaint } from './types/image/figma-image-like-paint.ts';
import type { FigmaSolidPaint } from './types/solid/figma-solid-paint.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#paint-type
 */
export type FigmaPaint = FigmaSolidPaint | FigmaGradiantPaint | FigmaImageLikePaint;
