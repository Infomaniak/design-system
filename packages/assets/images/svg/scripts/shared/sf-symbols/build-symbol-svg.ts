import {
  applyPathTransformToPathData,
  type PathTransform,
} from '../icons/bake-transform-into-path.ts';
import type { SvgOutlinePath, WindingRule } from '../icons/outline-path.ts';
import type { SymbolTemplate, SymbolTemplateVariant } from './parse-symbol-template.ts';
import { SYMBOL_FILL_RATIO, SYMBOL_OUTLINE_VIEW_BOX_SIZE } from './sf-symbols-config.ts';

export interface FittedSymbolPath {
  readonly d: string;
  readonly windingRule: WindingRule;
}

const EVENODD_WINDING_RULE = 'EVENODD';
const EVENODD_FILL_RULE_ATTRIBUTE = 'evenodd';

export function fitSymbolOutlinePathsToVariant({
  outlinedPaths,
  variant,
  template,
}: {
  readonly outlinedPaths: readonly SvgOutlinePath[];
  readonly variant: SymbolTemplateVariant;
  readonly template: SymbolTemplate;
}): readonly FittedSymbolPath[] {
  const cellHeight: number = template.baselineY - template.caplineY;

  /*
    Maps the outline canvas (0..SYMBOL_OUTLINE_VIEW_BOX_SIZE) onto the cell instead of the tight
    artwork bounding box, preserving the padding designed inside the canvas (as in web icons).
    Template cells are wider than tall, so the canvas is height-anchored: its top and bottom
    edges land on the capline and baseline.
   */
  const scale: number =
    Math.min(
      variant.cellWidth / SYMBOL_OUTLINE_VIEW_BOX_SIZE,
      cellHeight / SYMBOL_OUTLINE_VIEW_BOX_SIZE,
    ) * SYMBOL_FILL_RATIO;
  const translateX: number = variant.cellWidth / 2 - (scale * SYMBOL_OUTLINE_VIEW_BOX_SIZE) / 2;
  const translateY: number = -cellHeight / 2 - (scale * SYMBOL_OUTLINE_VIEW_BOX_SIZE) / 2;

  const fitTransform: PathTransform = [
    [scale, 0, translateX],
    [0, scale, translateY],
  ];

  return outlinedPaths.map(({ d, windingRule }: SvgOutlinePath): FittedSymbolPath => {
    return { d: applyPathTransformToPathData(d, fitTransform), windingRule };
  });
}

export function buildSymbolSvg({
  symbolName,
  outlinedPaths,
  template,
}: {
  readonly symbolName: string;
  readonly outlinedPaths: readonly SvgOutlinePath[];
  readonly template: SymbolTemplate;
}): string {
  if (outlinedPaths.length === 0) {
    throw new Error(`Symbol ${JSON.stringify(symbolName)} has no outline paths.`);
  }

  let content: string = template.content;

  for (const variant of template.variants) {
    const fittedPaths: readonly FittedSymbolPath[] = fitSymbolOutlinePathsToVariant({
      outlinedPaths,
      variant,
      template,
    });

    const groupPattern: RegExp = new RegExp(`(<g id="${variant.id}"[^>]*>)[\\s\\S]*?(</g>)`);
    if (!groupPattern.test(content)) {
      throw new Error(`Template group ${JSON.stringify(variant.id)} not found.`);
    }
    content = content.replace(groupPattern, `$1\n    ${fittedPathsToSvg(fittedPaths)}\n   $2`);
  }

  content = content.replace(
    /(<text id="descriptive-name"[^>]*>)[^<]*(<\/text>)/,
    `$1Generated from ${symbolName}$2`,
  );

  return content;
}

function fittedPathsToSvg(fittedPaths: readonly FittedSymbolPath[]): string {
  return fittedPaths
    .map(({ d, windingRule }: FittedSymbolPath): string => {
      const fillRule: string =
        windingRule === EVENODD_WINDING_RULE ? ` fill-rule="${EVENODD_FILL_RULE_ATTRIBUTE}"` : '';
      return `<path class="SFSymbolsPreviewWireframe" d="${d}"${fillRule}/>`;
    })
    .join('\n    ');
}
