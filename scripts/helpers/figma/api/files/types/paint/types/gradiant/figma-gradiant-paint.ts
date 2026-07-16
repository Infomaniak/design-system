import type { GenericFigmaPaintBase } from '../../base/figma-paint-base.ts';
import type { FigmaSolidPaint } from '../solid/figma-solid-paint.ts';
import {
  type FigmaGradiantAngularPaint,
  isFigmaGradiantAngularPaint,
} from './types/angular/figma-gradiant-angular-paint.ts';
import {
  type FigmaGradiantDiamondPaint,
  isFigmaGradiantDiamondPaint,
} from './types/diamond/figma-gradiant-diamond-paint.ts';
import {
  type FigmaGradiantLinearPaint,
  isFigmaGradiantLinearPaint,
} from './types/linear/figma-gradiant-linear-paint.ts';
import {
  type FigmaGradiantRadialPaint,
  isFigmaGradiantRadialPaint,
} from './types/radial/figma-gradiant-radial-paint.ts';

export type FigmaGradiantPaint =
  | FigmaGradiantLinearPaint
  | FigmaGradiantRadialPaint
  | FigmaGradiantAngularPaint
  | FigmaGradiantDiamondPaint;

export function isFigmaGradiantPaint(input: GenericFigmaPaintBase): input is FigmaSolidPaint {
  return (
    isFigmaGradiantLinearPaint(input) ||
    isFigmaGradiantRadialPaint(input) ||
    isFigmaGradiantAngularPaint(input) ||
    isFigmaGradiantDiamondPaint(input)
  );
}
