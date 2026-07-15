import { dedent } from '../../../../../../../../misc/string/dedent/dedent.ts';
import { applyFigmaTransformToSvgContent } from '../../../../../types/transform/to/svg/apply-figma-transform-to-svg-content.ts';

import { genericFigmaNodeToSvgContent } from '../../../../base/to/svg/generic-figma-node-to-svg-content.ts';
import type { FigmaBooleanOperationNode } from '../../figma-boolean-operation-node.ts';

/**
 * Converts a Figma boolean operation node into its corresponding SVG content as a string.
 *
 * @param {FigmaBooleanOperationNode} node - The FigmaBooleanOperationNode to be converted.
 * @return The SVG content as a string representing the given Figma boolean operation node.
 */
export function figmaBooleanOperationNodeToSvgContent(node: FigmaBooleanOperationNode): string {
  switch (node.booleanOperation) {
    case 'SUBTRACT':
      return figmaSubtractBooleanOperationNodeToSvgContent(node);
    default:
      throw new Error(`Unsupported boolean operation: ${node.booleanOperation}`);
  }
}

/* INTERNAL */

function figmaSubtractBooleanOperationNodeToSvgContent(node: FigmaBooleanOperationNode): string {
  const [base, ...cutouts] = node.children;

  const maskId = `mask-${node.id.replace(/:/g, '-')}`;

  return applyFigmaTransformToSvgContent(
    node.relativeTransform,
    dedent`
      <defs>
        <mask id="${maskId}" fill="transparent">
          <rect x="0" y="0" width="999" height="999" fill="white"/>
          ${replaceSvgFillAndStroke(cutouts.map(genericFigmaNodeToSvgContent).join('\n'), 'black')}
        </mask>
      </defs>
      <g mask="url(#${maskId})">
        ${genericFigmaNodeToSvgContent(base)}
      </g>
    `,
  );
}

function replaceSvgFillAndStroke(content: string, newValue: string): string {
  return content
    .replace(/stroke="([^"]*)"/g, (_, value: string): string => {
      return `stroke="${value === 'none' ? value : newValue}"`;
    })
    .replace(/fill="([^"]*)"/g, (_, value: string): string => {
      return `fill="${value === 'none' ? value : newValue}"`;
    });
}
