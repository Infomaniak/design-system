import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface SymbolTemplateVariant {
  readonly id: string;
  readonly translateX: number;
  readonly translateY: number;
  readonly cellWidth: number;
}

export interface SymbolTemplate {
  readonly content: string;
  readonly variants: readonly SymbolTemplateVariant[];
  readonly caplineY: number;
  readonly baselineY: number;
}

const TEMPLATE_VARIANT_IDS: readonly string[] = ['Ultralight-S', 'Regular-S', 'Black-S'];

const TEMPLATE_FILE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../assets/sf-symbols/sf-symbols-template.svg',
);

export async function readSymbolTemplate(): Promise<SymbolTemplate> {
  return parseSymbolTemplate(await readFile(TEMPLATE_FILE_PATH, { encoding: 'utf8' }));
}

export function parseSymbolTemplate(content: string): SymbolTemplate {
  const variants: SymbolTemplateVariant[] = [];

  for (const id of TEMPLATE_VARIANT_IDS) {
    const groupMatch: RegExpMatchArray | null = new RegExp(
      `<g id="${id}" transform="matrix\\(1 0 0 1 ([0-9.]+) ([0-9.]+)\\)">`,
    ).exec(content);
    if (groupMatch === null) {
      throw new Error(`Template group ${JSON.stringify(id)} not found.`);
    }

    const leftMargin: number = parseTemplateLineCoordinate(content, `left-margin-${id}`, 'x1');
    const rightMargin: number = parseTemplateLineCoordinate(content, `right-margin-${id}`, 'x1');

    variants.push({
      id,
      translateX: Number(groupMatch[1]),
      translateY: Number(groupMatch[2]),
      cellWidth: rightMargin - leftMargin,
    });
  }

  const caplineY: number = parseTemplateLineCoordinate(content, 'Capline-S', 'y1');
  const baselineY: number = parseTemplateLineCoordinate(content, 'Baseline-S', 'y1');

  return { content, variants, caplineY, baselineY };
}

function parseTemplateLineCoordinate(content: string, lineId: string, attribute: string): number {
  const match: RegExpMatchArray | null = new RegExp(
    `<line id="${lineId}"[^>]* ${attribute}="([0-9.]+)"`,
  ).exec(content);
  if (match === null) {
    throw new Error(`Template line ${JSON.stringify(lineId)} not found.`);
  }
  return Number(match[1]);
}

export function getSymbolTemplateVariant(
  template: SymbolTemplate,
  id: string,
): SymbolTemplateVariant {
  const variant: SymbolTemplateVariant | undefined = template.variants.find(
    ({ id: variantId }: SymbolTemplateVariant): boolean => variantId === id,
  );
  if (variant === undefined) {
    throw new Error(`Template variant ${JSON.stringify(id)} not found.`);
  }
  return variant;
}
