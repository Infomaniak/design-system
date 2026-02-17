import { type FigmaColor } from '../../types/figma-color.ts';
import { type FigmaRectangle } from '../../types/figma-rectangle.ts';
import { type FigmaVector } from '../../types/figma-vector.ts';
import { type FigmaNode } from '../figma-node.ts';
import type { HavingFigmaNodeChildren } from '../having-figma-node-children.ts';

export interface FigmaFrameNodeProperties extends HavingFigmaNodeChildren {
  readonly locked: boolean;
  readonly background: readonly unknown[];
  readonly backgroundColor: FigmaColor;
  readonly fills: readonly unknown[];
  readonly strokes: readonly unknown[];
  readonly strokeWeight: number;
  readonly strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  readonly strokeDashes: readonly number[];
  readonly cornerRadius: number;
  readonly rectangleCornerRadii: readonly number[];
  readonly cornerSmoothing: number;
  readonly exportSettings: readonly unknown[];
  readonly blendMode: unknown;
  readonly preserveRatio: boolean;
  readonly constraints: unknown;
  readonly layoutAlign: 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX';
  readonly interactions: readonly unknown[];
  readonly transitionNodeID: string;
  readonly transitionDuration: number;
  readonly transitionEasing: unknown;
  readonly opacity: number;
  readonly absoluteBoundingBox: FigmaRectangle;
  readonly absoluteRenderBounds: FigmaRectangle | null;
  readonly size: FigmaVector;
  readonly minWidth: number | null;
  readonly maxWidth: number | null;
  readonly minHeight: number | null;
  readonly maxHeight: number | null;
  // ... TODO
}

export interface FigmaFrameNode extends FigmaNode<'FRAME'>, FigmaFrameNodeProperties {}

export function isFigmaFrameNode(input: FigmaNode): input is FigmaFrameNode {
  return input.type === 'FRAME';
}
