import { type FigmaNode } from './figma-node.ts';
import type { FigmaNodeWithChildren } from './types/figma-node-with-children.ts';

export interface FigmaDocumentNode extends FigmaNode<'DOCUMENT'>, FigmaNodeWithChildren {}

export function isFigmaDocumentNode(input: FigmaNode): input is FigmaDocumentNode {
  return input.type === 'DOCUMENT';
}
