import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';
import type { HavingFigmaVectorNodeProperties } from './figma-vector-node.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#boolean-operation-props
 */
export interface FigmaBooleanOperationNode
  extends
    FigmaNode<'BOOLEAN_OPERATION'>,
    HavingFigmaVectorNodeProperties,
    HavingFigmaNodeChildren,
    HavingFigmaAbsoluteBoundingBox {
  readonly booleanOperation: 'UNION' | 'INTERSECT' | 'SUBTRACT' | 'EXCLUDE';
}

export function isFigmaBooleanOperationNode(
  input: GenericFigmaNode,
): input is FigmaBooleanOperationNode {
  return input.type === 'BOOLEAN_OPERATION';
}
