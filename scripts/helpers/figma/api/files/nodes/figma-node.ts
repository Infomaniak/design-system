import type { FigmaBooleanOperationNode } from './built-in/boolean-operation/figma-boolean-operation-node.ts';
import type { FigmaComponentNode } from './built-in/component/figma-component-node.ts';
import type { FigmaCanvasNode } from './built-in/figma-canvas-node.ts';
import type { FigmaComponentSetNode } from './built-in/figma-component-set-node.ts';
import type { FigmaDocumentNode } from './built-in/figma-document-node.ts';
import type { FigmaFrameNode } from './built-in/figma-frame-node.ts';
import type { FigmaGroupNode } from './built-in/figma-group-node.ts';
import type { FigmaSectionNode } from './built-in/figma-section-node.ts';
import type { FigmaTableNode } from './built-in/figma-table-node.ts';
import type { FigmaVectorNode } from './built-in/vector/figma-vector-node.ts';

export type FigmaNode =
  | FigmaDocumentNode
  | FigmaCanvasNode
  | FigmaFrameNode
  // | FigmaTransformGroupNode TODO
  | FigmaGroupNode
  | FigmaSectionNode
  | FigmaVectorNode
  | FigmaBooleanOperationNode
  // ...TODO
  | FigmaTableNode
  // ...TODO
  | FigmaComponentNode
  | FigmaComponentSetNode;
// ...TODO
