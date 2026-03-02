import { type GenericFigmaNode } from './figma-node.ts';

export interface HavingFigmaNodeChildren {
  readonly children: readonly GenericFigmaNode[];
}
