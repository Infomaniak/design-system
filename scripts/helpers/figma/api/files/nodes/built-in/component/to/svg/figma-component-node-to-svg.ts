import { dedent } from '../../../../../../../../misc/string/dedent/dedent.ts';
import { genericFigmaNodeToSvgContent } from '../../../../base/to/svg/generic-figma-node-to-svg-content.ts';
import type { FigmaComponentNode } from '../../figma-component-node.ts';

export function figmaComponentNodeToSvg({
  absoluteBoundingBox: { width, height },
  children,
}: FigmaComponentNode): string {
  return dedent`
    <svg width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}" xmlns="http://www.w3.org/2000/svg">
      ${children.map(genericFigmaNodeToSvgContent).join('\n')}
    </svg>
  `;
}
