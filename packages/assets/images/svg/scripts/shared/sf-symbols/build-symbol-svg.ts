import {
  applyPathTransformToPathData,
  computePathDataBoundingBox,
  type PathBoundingBox,
  type PathTransform,
} from '../icons/bake-transform-into-path.ts';
import type { SvgOutlinePath, WindingRule } from '../icons/outline-path.ts';
import type { SymbolTemplate, SymbolTemplateVariant } from './parse-symbol-template.ts';
import { SYMBOL_FILL_RATIO } from './sf-symbols-config.ts';

export interface FittedSymbolPath {
  readonly d: string;
  readonly windingRule: WindingRule;
}

const EVENODD_WINDING_RULE = 'EVENODD';
const EVENODD_FILL_RULE_ATTRIBUTE = 'evenodd';

export function fitSymbolOutlinePathsToVariant({
  outlinedPaths,
  boundingBox,
  variant,
  template,
}: {
  readonly outlinedPaths: readonly SvgOutlinePath[];
  readonly boundingBox: PathBoundingBox;
  readonly variant: SymbolTemplateVariant;
  readonly template: SymbolTemplate;
}): readonly FittedSymbolPath[] {
  const iconWidth: number = boundingBox.maxX - boundingBox.minX;
  const iconHeight: number = boundingBox.maxY - boundingBox.minY;
  const cellHeight: number = template.baselineY - template.caplineY;

  const scale: number =
    Math.min(variant.cellWidth / iconWidth, cellHeight / iconHeight) * SYMBOL_FILL_RATIO;
  const translateX: number =
    variant.cellWidth / 2 - (scale * (boundingBox.minX + boundingBox.maxX)) / 2;
  const translateY: number = -cellHeight / 2 - (scale * (boundingBox.minY + boundingBox.maxY)) / 2;

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

  const boundingBox: PathBoundingBox = computePathDataBoundingBox(
    outlinedPaths.map(({ d }: SvgOutlinePath): string => d).join(' '),
  );

  let content: string = template.content;

  for (const variant of template.variants) {
    const fittedPaths: readonly FittedSymbolPath[] = fitSymbolOutlinePathsToVariant({
      outlinedPaths,
      boundingBox,
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
