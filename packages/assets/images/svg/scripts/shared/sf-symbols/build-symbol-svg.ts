import {
  applyPathTransformToPathData,
  computePathsBoundingBox,
  type PathBoundingBox,
  type PathTransform,
} from '../icons/bake-transform-into-path.ts';
import type { SvgOutlinePath, WindingRule } from '../icons/outline-path.ts';
import type { SymbolTemplate, SymbolTemplateVariant } from './parse-symbol-template.ts';
import { SYMBOL_CANVAS_SIZE, SYMBOL_FILL_RATIO } from './sf-symbols-config.ts';

export interface FittedSymbolPath {
  readonly d: string;
  readonly windingRule: WindingRule;
}

const EVENODD_WINDING_RULE = 'EVENODD';
const EVENODD_FILL_RULE_ATTRIBUTE = 'evenodd';
const CANVAS_OVERFLOW_TOLERANCE = 0.01;

export function getSymbolCanvasScale({
  variant,
  template,
}: {
  readonly variant: SymbolTemplateVariant;
  readonly template: SymbolTemplate;
}): number {
  const cellHeight: number = template.baselineY - template.caplineY;
  if (variant.cellWidth < cellHeight) {
    throw new Error(
      `Template cell ${JSON.stringify(variant.id)} width ${variant.cellWidth} is smaller than the cell height ${cellHeight}; the design-canvas mapping requires wider cells.`,
    );
  }
  return (cellHeight / SYMBOL_CANVAS_SIZE) * SYMBOL_FILL_RATIO;
}

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
  const scale: number = getSymbolCanvasScale({ variant, template });

  const translateX: number = variant.cellWidth / 2 - (scale * SYMBOL_CANVAS_SIZE) / 2;
  const translateY: number = -cellHeight / 2 - (scale * SYMBOL_CANVAS_SIZE) / 2;

  const fitTransform: PathTransform = [
    [scale, 0, translateX],
    [0, scale, translateY],
  ];

  return outlinedPaths.map(({ d, windingRule }: SvgOutlinePath): FittedSymbolPath => {
    return { d: applyPathTransformToPathData(d, fitTransform), windingRule };
  });
}

export function getSymbolCanvasOverflowWarnings({
  symbolName,
  outlinedPaths,
  template,
}: {
  readonly symbolName: string;
  readonly outlinedPaths: readonly SvgOutlinePath[];
  readonly template: SymbolTemplate;
}): readonly string[] {
  // per-path bounding box: joining path data strings would resolve a relative
  // command against the previous path's endpoint
  const boundingBox: PathBoundingBox = computePathsBoundingBox(
    outlinedPaths.map(({ d }: SvgOutlinePath): string => d),
  );

  const narrowestVariant: SymbolTemplateVariant = template.variants.reduce(
    (narrowest: SymbolTemplateVariant, variant: SymbolTemplateVariant): SymbolTemplateVariant => {
      return variant.cellWidth < narrowest.cellWidth ? variant : narrowest;
    },
  );
  const scale: number = getSymbolCanvasScale({ variant: narrowestVariant, template });
  const canvasEdge: number = SYMBOL_CANVAS_SIZE * scale;
  const horizontalSlack: number = (narrowestVariant.cellWidth - canvasEdge) / 2 / scale;
  const verticalSlack: number = (template.baselineY - template.caplineY - canvasEdge) / 2 / scale;

  // [side, canvas overshoot, rendering slack in the symbol cell]
  const sides: readonly (readonly [string, number, number])[] = [
    ['left', -boundingBox.minX, horizontalSlack],
    ['top', -boundingBox.minY, verticalSlack],
    ['right', boundingBox.maxX - SYMBOL_CANVAS_SIZE, horizontalSlack],
    ['bottom', boundingBox.maxY - SYMBOL_CANVAS_SIZE, verticalSlack],
  ];

  const overflowingSides: readonly string[] = sides
    .filter(([, overshoot]: readonly [string, number, number]): boolean => {
      return overshoot > CANVAS_OVERFLOW_TOLERANCE;
    })
    .map(([side, overshoot, slack]: readonly [string, number, number]): string => {
      const consequence: string =
        overshoot > slack + CANVAS_OVERFLOW_TOLERANCE
          ? 'renders outside the symbol cell'
          : 'renders within the symbol cell margins';
      return `${side} ${Number(overshoot.toFixed(3))}: ${consequence}`;
    });

  if (overflowingSides.length === 0) {
    return [];
  }

  return [
    `Symbol ${JSON.stringify(symbolName)} artwork overflows the ${SYMBOL_CANVAS_SIZE}×${SYMBOL_CANVAS_SIZE} design canvas (${overflowingSides.join(', ')}); it is kept proportional.`,
  ];
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
