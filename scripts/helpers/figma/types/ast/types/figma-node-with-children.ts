import { type FigmaNode } from '../figma-node.ts';

export interface FigmaNodeWithChildren {
  readonly children: readonly FigmaNode[];
}
