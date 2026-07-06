import type { FigmaColor } from '../../types/color/figma-color.ts';
import type { FigmaPrototypeDevice } from '../../types/figma-prototype-device.ts';
import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#canvas-props
 */
export interface FigmaCanvasNode extends FigmaNode<'CANVAS'>, HavingFigmaNodeChildren {
  readonly backgroundColor: FigmaColor;
  /**
   * @deprecated
   */
  readonly prototypeStartNodeID: string | null;
  readonly flowStartingPoints: readonly unknown /* TODO */[];
  readonly prototypeDevice: FigmaPrototypeDevice;
  readonly exportSettings: readonly unknown /* TODO */[];
  readonly measurements: readonly unknown /* TODO */[];
}

export function isFigmaCanvasNode(input: GenericFigmaNode): input is FigmaCanvasNode {
  return input.type === 'CANVAS';
}
