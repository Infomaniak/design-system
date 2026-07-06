import type { GenericFigmaNode } from '../figma-node.ts';

export function isFigmaNodeVisible(node: GenericFigmaNode): boolean {
  return node.visible === undefined || node.visible;
}
