import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { glob, readFile } from 'node:fs/promises';
import { basename, join, parse, sep } from 'node:path';
import { writeJsonFileSafe } from '../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { APPLE_SYMBOL_TEMPLATE, SVG_PROLOG } from './apple-symbol-template.ts';

export interface ConvertSvgToSymbolsetOptions {
  readonly inputDirectory: string;
  readonly outputDirectory: string;
  readonly prefix: string;
  readonly logger: Logger;
}

const ROOT_CONTENTS_JSON = { info: { author: 'xcode', version: 1 } };

const XCASSETS_NAME = 'Icons.xcassets';

const WIREFRAME_CLASS = 'SFSymbolsPreviewWireframe';

const MASTER_WEIGHT_IDS = ['Ultralight-S', 'Regular-S', 'Black-S'] as const;

const SVG_VIEWBOX_SIZE = 24;
const SF_SYMBOL_SIZE = 100;
const SCALE_FACTOR = SF_SYMBOL_SIZE / SVG_VIEWBOX_SIZE;

export type OrderedNode = {
  readonly [key: string]: unknown;
  readonly ':@'?: Record<string, string>;
};

export function buildSymbolContentsJson(iconName: string): { symbols: unknown[]; info: unknown } {
  return {
    symbols: [{ filename: `${iconName}.svg`, idiom: 'universal' }],
    info: { author: 'xcode', version: 1 },
  };
}

export function findGroupById(parsed: OrderedNode[], id: string): OrderedNode | undefined {
  const svgRoot: OrderedNode | undefined = parsed.find((node: OrderedNode): boolean =>
    Object.prototype.hasOwnProperty.call(node, 'svg'),
  );

  if (svgRoot === undefined) return undefined;

  const children: unknown = svgRoot['svg'];
  if (!Array.isArray(children)) return undefined;

  return (children as OrderedNode[]).find((child: OrderedNode): boolean => {
    const attrs: Record<string, string> | undefined = child[':@'];
    return attrs !== undefined && attrs['@_id'] === id;
  });
}

function buildPathNode(pathData: string): OrderedNode {
  return {
    path: [],
    ':@': {
      '@_d': pathData,
      '@_class': WIREFRAME_CLASS,
    },
  };
}

function extractPathData(svgString: string): string[] {
  const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
  const parsed = parser.parse(svgString) as OrderedNode[];

  const result: string[] = [];

  function walk(nodes: OrderedNode[]): void {
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, 'path')) {
        const attrs = node[':@'];
        if (attrs !== undefined && attrs['@_d'] !== undefined) {
          result.push(attrs['@_d']);
        }
      }

      for (const key of Object.keys(node)) {
        if (key === ':@') continue;
        const children = node[key];
        if (Array.isArray(children)) {
          walk(children as OrderedNode[]);
        }
      }
    }
  }

  walk(parsed);
  return result;
}

function transformPathData(pathData: string): string {
  const commands = pathData.match(/[MLHVCSQTAZmlhvcsqtaz]|-?\d+(?:\.\d+)?/g);
  if (commands === null) return pathData;

  let i = 0;
  let isX = true;
  let result = '';

  while (i < commands.length) {
    const token = commands[i];

    if (/[MLHVCSQTAZmlhvcsqtaz]/.test(token)) {
      isX = true;
      result += token;

      switch (token.toUpperCase()) {
        case 'H':
          i++;
          while (i < commands.length && !/[MLHVCSQTAZmlhvcsqtaz]/.test(commands[i]!)) {
            result += ' ' + transformX(parseFloat(commands[i]!));
            i++;
          }
          break;
        case 'V':
          i++;
          while (i < commands.length && !/[MLHVCSQTAZmlhvcsqtaz]/.test(commands[i]!)) {
            result += ' ' + transformY(parseFloat(commands[i]!));
            i++;
          }
          break;
        case 'A':
          i++;
          while (i < commands.length && !/[MLHVCSQTAZmlhvcsqtaz]/.test(commands[i]!)) {
            const rx = parseFloat(commands[i]!);
            const ry = parseFloat(commands[i + 1]!);
            const xRot = parseFloat(commands[i + 2]!);
            const largeArc = parseFloat(commands[i + 3]!);
            const sweep = parseFloat(commands[i + 4]!);
            const x = parseFloat(commands[i + 5]!);
            const y = parseFloat(commands[i + 6]!);
            result += ` ${transformX(rx)} ${transformY(ry)} ${xRot} ${largeArc} ${sweep} ${transformX(x)} ${transformY(y)}`;
            i += 7;
          }
          break;
        default:
          i++;
          isX = true;
          while (i < commands.length && !/[MLHVCSQTAZmlhvcsqtaz]/.test(commands[i]!)) {
            const val = parseFloat(commands[i]!);
            result += ' ' + (isX ? transformX(val) : transformY(val));
            isX = !isX;
            i++;
          }
          break;
      }
    } else {
      i++;
    }
  }

  return result;
}

function transformX(value: number): string {
  return String(parseFloat((value * SCALE_FACTOR).toFixed(4)));
}

function transformY(value: number): string {
  return String(parseFloat((value * SCALE_FACTOR - SF_SYMBOL_SIZE).toFixed(4)));
}

export function injectMastersIntoTemplate(
  parsedTemplate: OrderedNode[],
  svgString: string,
): void {
  const symbolsGroup: OrderedNode | undefined = findGroupById(parsedTemplate, 'Symbols');

  if (symbolsGroup === undefined) {
    throw new Error('No <g id="Symbols"> found in Apple template.');
  }

  const weightGroups: unknown = symbolsGroup['g'];
  if (!Array.isArray(weightGroups)) {
    throw new Error('Symbols group has no child elements.');
  }

  const pathDataList: string[] = extractPathData(svgString).map(transformPathData);

  for (const group of weightGroups as OrderedNode[]) {
    const groupAttrs: Record<string, string> | undefined = group[':@'];
    if (groupAttrs === undefined) continue;

    const weightId: string | undefined = groupAttrs['@_id'];
    if (weightId === undefined) continue;
    if (!(MASTER_WEIGHT_IDS as readonly string[]).includes(weightId)) continue;

    const pathNodes: OrderedNode[] = pathDataList.map(buildPathNode);

    (group as Record<string, unknown>)['g'] = pathNodes;
  }
}

export async function convertSvgToSymbolset({
  inputDirectory,
  outputDirectory,
  prefix,
  logger,
}: ConvertSvgToSymbolsetOptions): Promise<void> {
  return logger.asyncTask('sf-symbols', async (logger: Logger): Promise<void> => {
    const parser: XMLParser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: true,
      commentPropName: '#comment',
    });
    const builder: XMLBuilder = new XMLBuilder({
      ignoreAttributes: false,
      preserveOrder: true,
      format: true,
      commentPropName: '#comment',
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

        const parsedTemplate: OrderedNode[] = parser.parse(APPLE_SYMBOL_TEMPLATE) as OrderedNode[];
        injectMastersIntoTemplate(parsedTemplate, inputSvgStr);

        const outputSvgStr: string = SVG_PROLOG + builder.build(parsedTemplate);

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
