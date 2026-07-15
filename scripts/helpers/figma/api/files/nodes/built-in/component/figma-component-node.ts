import type { FigmaNodeBase, GenericFigmaNodeBase } from '../../base/figma-node-base.ts';
import type { HavingOptionalFigmaComponentPropertyDefinitions } from '../../having/having-figma-component-property-definitions.ts';
import type { HavingFigmaFrameNodeProperties } from '../figma-frame-node.ts';

export interface FigmaComponentNode
  extends
    FigmaNodeBase<'COMPONENT'>,
    HavingFigmaFrameNodeProperties,
    HavingOptionalFigmaComponentPropertyDefinitions {
  // ...HavingOptionalFigmaComponentPropertyDefinitions
}

export function isFigmaComponentNode(input: GenericFigmaNodeBase): input is FigmaComponentNode {
  return input.type === 'COMPONENT';
}
