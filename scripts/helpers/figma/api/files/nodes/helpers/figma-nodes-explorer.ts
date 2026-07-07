import { TreeExplorer } from '../../../../../misc/tree-explorer/tree-explorer.ts';
import type { GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import { isFigmaComponentNode } from '../built-in/component/figma-component-node.ts';
import { isFigmaBooleanOperationNode } from '../built-in/figma-boolean-operation-node.ts';
import { isFigmaCanvasNode } from '../built-in/figma-canvas-node.ts';
import { isFigmaComponentSetNode } from '../built-in/figma-component-set-node.ts';
import { isFigmaDocumentNode } from '../built-in/figma-document-node.ts';
import { isFigmaFrameNode } from '../built-in/figma-frame-node.ts';
import { isFigmaGroupNode } from '../built-in/figma-group-node.ts';
import { isFigmaSectionNode } from '../built-in/figma-section-node.ts';
import { isFigmaTableNode } from '../built-in/figma-table-node.ts';

export const FigmaNodesExplorer = new TreeExplorer<GenericFigmaNodeBase>(
  (node: GenericFigmaNodeBase): Iterable<GenericFigmaNodeBase> => {
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
  },
);
