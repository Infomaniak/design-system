import type { FigmaNodeBase, GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

export interface FigmaTableNode extends FigmaNodeBase<'TABLE'>, HavingFigmaNodeChildren {
  // TODO
}

export function isFigmaTableNode(input: GenericFigmaNodeBase): input is FigmaTableNode {
  return input.type === 'TABLE';
}
