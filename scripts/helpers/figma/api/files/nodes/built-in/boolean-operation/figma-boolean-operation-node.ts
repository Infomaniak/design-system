import type { FigmaBooleanOperation } from '../../../types/figma-boolean-operation.ts';
import type { FigmaNodeBase, GenericFigmaNodeBase } from '../../base/figma-node-base.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaNodeChildren } from '../../having/having-figma-node-children.ts';
import type { HavingFigmaVectorNodeProperties } from '../vector/figma-vector-node.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#boolean-operation-props
 */
export interface FigmaBooleanOperationNode
  extends
    FigmaNodeBase<'BOOLEAN_OPERATION'>,
    HavingFigmaVectorNodeProperties,
    HavingFigmaNodeChildren,
    HavingFigmaAbsoluteBoundingBox {
  readonly booleanOperation: FigmaBooleanOperation;
}

export function isFigmaBooleanOperationNode(
  input: GenericFigmaNodeBase,
): input is FigmaBooleanOperationNode {
  return input.type === 'BOOLEAN_OPERATION';
}
