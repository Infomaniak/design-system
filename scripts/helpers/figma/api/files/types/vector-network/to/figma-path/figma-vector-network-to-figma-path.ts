import type { FigmaPath } from '../../../path/figma-path.ts';
import type { FigmaVectorNetwork } from '../../figma-vector-network.ts';
import { figmaVectorNetworkToSvgPath } from '../svg/figma-vector-network-to-svg-path.ts';

export function figmaVectorNetworkToFigmaPath(vectorNetwork: FigmaVectorNetwork): FigmaPath {
  return {
    path: figmaVectorNetworkToSvgPath(vectorNetwork),
    windingRule: 'NONZERO',
  };
}
