import type { FigmaNode } from '../figma-node.ts';
import type { HavingFigmaNodeChildren } from '../having-figma-node-children.ts';

export interface FigmaDocumentNode extends FigmaNode<'DOCUMENT'>, HavingFigmaNodeChildren {}

export function isFigmaDocumentNode(input: FigmaNode): input is FigmaDocumentNode {
  return input.type === 'DOCUMENT';
}
