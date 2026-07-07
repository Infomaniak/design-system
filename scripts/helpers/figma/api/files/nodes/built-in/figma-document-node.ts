import type { FigmaNodeBase, GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#document-props
 */
export interface FigmaDocumentNode extends FigmaNodeBase<'DOCUMENT'>, HavingFigmaNodeChildren {}

export function isFigmaDocumentNode(input: GenericFigmaNodeBase): input is FigmaDocumentNode {
  return input.type === 'DOCUMENT';
}
