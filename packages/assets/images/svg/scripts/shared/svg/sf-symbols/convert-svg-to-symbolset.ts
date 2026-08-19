import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { glob, readFile } from 'node:fs/promises';
import { basename, join, parse, sep } from 'node:path';
import { writeJsonFileSafe } from '../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { APPLE_SYMBOL_TEMPLATE } from './apple-symbol-template.ts';
import { BASE_STROKE_WIDTH, WEIGHT_MULTIPLIERS } from './weight-multipliers.ts';

export interface ConvertSvgToSymbolsetOptions {
  readonly inputDirectory: string;
  readonly outputDirectory: string;
  readonly prefix: string;
  readonly logger: Logger;
}

const ROOT_CONTENTS_JSON = { info: { author: 'xcode', version: 1 } };

const XCASSETS_NAME = 'Icons.xcassets';

type OrderedNode = {
  readonly [key: string]: unknown;
  readonly ':@'?: Record<string, string>;
};

function buildSymbolContentsJson(iconName: string): { symbols: unknown[]; info: unknown } {
  return {
    symbols: [{ filename: `${iconName}.svg`, idiom: 'universal' }],
    info: { author: 'xcode', version: 1 },
  };
}

function extractSvgInnerContent(parsedSvg: OrderedNode[]): OrderedNode[] {
  const svgRoot: OrderedNode | undefined = parsedSvg.find((node: OrderedNode): boolean =>
    Object.prototype.hasOwnProperty.call(node, 'svg'),
  );

  if (svgRoot === undefined) {
    throw new Error('No <svg> root element found in input SVG.');
  }

  const innerContent: unknown = svgRoot['svg'];
  if (!Array.isArray(innerContent)) {
    return [];
  }

  return innerContent as OrderedNode[];
}

function findGroupById(parsed: OrderedNode[], id: string): OrderedNode | undefined {
  const svgRoot: OrderedNode | undefined = parsed.find((node: OrderedNode): boolean =>
    Object.prototype.hasOwnProperty.call(node, 'svg'),
  );

  if (svgRoot === undefined) {
    return undefined;
  }

  const children: unknown = svgRoot['svg'];
  if (!Array.isArray(children)) {
    return undefined;
  }

  return (children as OrderedNode[]).find((child: OrderedNode): boolean => {
    const attrs: Record<string, string> | undefined = child[':@'];
    return attrs !== undefined && attrs['@_id'] === id;
  });
}

function isFillPath(attrs: Record<string, string>): boolean {
  return attrs['@_fill'] !== undefined && attrs['@_fill'] !== 'none';
}

function convertZeroBBoxPath(d: string, strokeWidth: number): string | undefined {
  const horizontalMatch = d.match(/^M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*H\s*(-?[\d.]+)$/);
  if (horizontalMatch) {
    const x1 = Math.min(parseFloat(horizontalMatch[1]), parseFloat(horizontalMatch[3]));
    const x2 = Math.max(parseFloat(horizontalMatch[1]), parseFloat(horizontalMatch[3]));
    const y = parseFloat(horizontalMatch[2]);
    const r = strokeWidth / 2;
    return (
      `M${x1.toFixed(4)} ${(y - r).toFixed(4)} ` +
      `L${x2.toFixed(4)} ${(y - r).toFixed(4)} ` +
      `A${r.toFixed(4)} ${r.toFixed(4)} 0 0 1 ${x2.toFixed(4)} ${(y + r).toFixed(4)} ` +
      `L${x1.toFixed(4)} ${(y + r).toFixed(4)} ` +
      `A${r.toFixed(4)} ${r.toFixed(4)} 0 0 1 ${x1.toFixed(4)} ${(y - r).toFixed(4)} ` +
      `Z`
    );
  }

  const verticalMatch = d.match(/^M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*V\s*(-?[\d.]+)$/);
  if (verticalMatch) {
    const x = parseFloat(verticalMatch[1]);
    const y1 = Math.min(parseFloat(verticalMatch[2]), parseFloat(verticalMatch[3]));
    const y2 = Math.max(parseFloat(verticalMatch[2]), parseFloat(verticalMatch[3]));
    const r = strokeWidth / 2;
    return (
      `M${(x - r).toFixed(4)} ${y1.toFixed(4)} ` +
      `L${(x - r).toFixed(4)} ${y2.toFixed(4)} ` +
      `A${r.toFixed(4)} ${r.toFixed(4)} 0 0 1 ${(x + r).toFixed(4)} ${y2.toFixed(4)} ` +
      `L${(x + r).toFixed(4)} ${y1.toFixed(4)} ` +
      `A${r.toFixed(4)} ${r.toFixed(4)} 0 0 1 ${(x - r).toFixed(4)} ${y1.toFixed(4)} ` +
      `Z`
    );
  }

  return undefined;
}

function applyWeightToPaths(innerContent: OrderedNode[], targetWidth: string): OrderedNode[] {
  const strokeWidth: number = parseFloat(targetWidth);

  return innerContent.map((node: OrderedNode): OrderedNode => {
    const attrs: Record<string, string> | undefined = node[':@'];
    if (attrs === undefined) {
      return node;
    }

    if (isFillPath(attrs)) {
      const filledAttrs: Record<string, string> = { ...attrs };
      delete filledAttrs['@_stroke'];
      delete filledAttrs['@_stroke-width'];
      delete filledAttrs['@_stroke-linecap'];
      delete filledAttrs['@_stroke-linejoin'];
      delete filledAttrs['@_fill'];

      filledAttrs['@_fill'] = 'currentColor';

      return { ...node, ':@': filledAttrs };
    }

    const d: string | undefined = attrs['@_d'];
    const outlinedD: string | undefined =
      d !== undefined ? convertZeroBBoxPath(d, strokeWidth) : undefined;

    if (outlinedD !== undefined) {
      const filledAttrs: Record<string, string> = { ...attrs };
      delete filledAttrs['@_stroke'];
      delete filledAttrs['@_stroke-width'];
      delete filledAttrs['@_stroke-linecap'];
      delete filledAttrs['@_stroke-linejoin'];
      delete filledAttrs['@_fill'];

      filledAttrs['@_d'] = outlinedD;
      filledAttrs['@_fill'] = 'currentColor';

      return { ...node, ':@': filledAttrs };
    }

    const cleanedAttrs: Record<string, string> = { ...attrs };
    delete cleanedAttrs['@_stroke'];
    delete cleanedAttrs['@_stroke-width'];
    delete cleanedAttrs['@_fill'];

    cleanedAttrs['@_stroke'] = 'currentColor';
    cleanedAttrs['@_stroke-width'] = targetWidth;
    cleanedAttrs['@_stroke-linecap'] = 'round';
    cleanedAttrs['@_stroke-linejoin'] = 'round';
    cleanedAttrs['@_fill'] = 'none';

    return { ...node, ':@': cleanedAttrs };
  });
}

function injectWeightsIntoTemplate(
  parsedTemplate: OrderedNode[],
  innerContent: OrderedNode[],
): void {
  const symbolsGroup: OrderedNode | undefined = findGroupById(parsedTemplate, 'Symbols');

  if (symbolsGroup === undefined) {
    throw new Error('No <g id="Symbols"> found in Apple template.');
  }

  const weightGroups: unknown = symbolsGroup['g'];
  if (!Array.isArray(weightGroups)) {
    throw new Error('Symbols group has no child elements.');
  }

  for (const group of weightGroups as OrderedNode[]) {
    const groupAttrs: Record<string, string> | undefined = group[':@'];
    if (groupAttrs === undefined) {
      continue;
    }

    const weightId: string | undefined = groupAttrs['@_id'];
    if (weightId === undefined) {
      continue;
    }

    const multiplier: number | undefined = WEIGHT_MULTIPLIERS[weightId];
    if (multiplier === undefined) {
      continue;
    }

    const targetWidth: string = (BASE_STROKE_WIDTH * multiplier).toFixed(2);

    const weightedPaths: OrderedNode[] = applyWeightToPaths(innerContent, targetWidth);

    (group as Record<string, unknown>)['g'] = weightedPaths;
  }
}

export async function convertSvgToSymbolset({
  inputDirectory,
  outputDirectory,
  prefix,
  logger,
}: ConvertSvgToSymbolsetOptions): Promise<void> {
  return logger.asyncTask('sf-symbols', async (logger: Logger): Promise<void> => {
    const parser: XMLParser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
    const builder: XMLBuilder = new XMLBuilder({
      ignoreAttributes: false,
      preserveOrder: true,
      format: true,
    });

    const xcassetsPath: string = join(outputDirectory, XCASSETS_NAME);

    await writeJsonFileSafe(join(xcassetsPath, 'Contents.json'), ROOT_CONTENTS_JSON);

    const svgFiles: string[] = [];

    for await (const entry of glob(`${inputDirectory}${sep}*.svg`)) {
      const filename: string = basename(entry);

      if (filename.endsWith('.mask.svg')) {
        continue;
      }

      svgFiles.push(entry);
    }

    if (svgFiles.length === 0) {
      throw new Error(`No SVG files found in ${inputDirectory}.`);
    }

    for (const svgFile of svgFiles) {
      const iconName: string = `${prefix}-${parse(svgFile).name}`;
      const symbolsetPath: string = join(xcassetsPath, `${iconName}.symbolset`);

      await logger.asyncTask(`convert:${iconName}`, async (): Promise<void> => {
        const inputSvgStr: string = await readFile(svgFile, 'utf-8');

        const parsedWebSvg: OrderedNode[] = parser.parse(inputSvgStr) as OrderedNode[];
        const innerContent: OrderedNode[] = extractSvgInnerContent(parsedWebSvg);

        const parsedTemplate: OrderedNode[] = parser.parse(APPLE_SYMBOL_TEMPLATE) as OrderedNode[];
        injectWeightsIntoTemplate(parsedTemplate, innerContent);

        const outputSvgStr: string = builder.build(parsedTemplate);

        await writeTextFileSafe(join(symbolsetPath, `${iconName}.svg`), outputSvgStr);
        await writeJsonFileSafe(
          join(symbolsetPath, 'Contents.json'),
          buildSymbolContentsJson(iconName),
        );
      });
    }

    logger.info(`Converted ${svgFiles.length} SVG files to SF Symbols.`);
  });
}
