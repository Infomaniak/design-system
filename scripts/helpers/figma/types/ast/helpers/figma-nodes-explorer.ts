import { TreeExplorer } from '../../../../misc/tree-explorer/tree-explorer.ts';
import { isFigmaBooleanOperationNode } from '../figma-boolean-operation-node.ts';
import { isFigmaCanvasNode } from '../figma-canvas-node.ts';
import { isFigmaComponentNode } from '../figma-component-node.ts';
import { isFigmaComponentSetNode } from '../figma-component-set-node.ts';
import { isFigmaDocumentNode } from '../figma-document-node.ts';
import { isFigmaFrameNode } from '../figma-frame-node.ts';
import { isFigmaGroupNode } from '../figma-group-node.ts';
import { type FigmaNode } from '../figma-node.ts';
import { isFigmaSectionNode } from '../figma-section-node.ts';
import { isFigmaTableNode } from '../figma-table-node.ts';

export class FigmaNodesExplorer extends TreeExplorer<FigmaNode> {
  constructor() {
    super((node: FigmaNode): Iterable<FigmaNode> => {
      if (
        isFigmaDocumentNode(node) ||
        isFigmaCanvasNode(node) ||
        isFigmaFrameNode(node) ||
        isFigmaGroupNode(node) ||
        isFigmaSectionNode(node) ||
        isFigmaBooleanOperationNode(node) ||
        isFigmaTableNode(node) ||
        isFigmaComponentNode(node) ||
        isFigmaComponentSetNode(node)
      ) {
        return node.children;
      } else {
        return [];
      }
    });
  }
}

export const FIGMA_NODES_EXPLORER = new FigmaNodesExplorer();
