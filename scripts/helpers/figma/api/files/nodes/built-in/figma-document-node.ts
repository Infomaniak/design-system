import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

export interface FigmaDocumentNode extends FigmaNode<'DOCUMENT'>, HavingFigmaNodeChildren {}

export function isFigmaDocumentNode(input: GenericFigmaNode): input is FigmaDocumentNode {
  return input.type === 'DOCUMENT';
}
