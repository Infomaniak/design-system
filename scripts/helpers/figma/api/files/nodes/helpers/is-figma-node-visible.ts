import type { GenericFigmaNodeBase } from '../base/figma-node-base.ts';

export function isFigmaNodeVisible(node: GenericFigmaNodeBase): boolean {
  return node.visible === undefined || node.visible;
}
