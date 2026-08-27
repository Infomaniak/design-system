import { XMLParser } from 'fast-xml-parser';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import {
  buildSymbolContentsJson,
  convertSvgToSymbolset,
  type ConvertSvgToSymbolsetOptions,
  findGroupById,
  injectMastersIntoTemplate,
  type OrderedNode,
} from './convert-svg-to-symbolset.ts';

const FILL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.125C18.0061 1.125 22.875 5.9939 22.875 12C22.875 18.0061 18.0061 22.875 12 22.875C5.9939 22.875 1.125 18.0061 1.125 12C1.125 5.9939 5.9939 1.125 12 1.125Z" fill="black"/></svg>`;

const MULTI_SUBPATH_FILL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.125C18.0061 1.125 22.875 5.9939 22.875 12C22.875 18.0061 18.0061 22.875 12 22.875C5.9939 22.875 1.125 18.0061 1.125 12C1.125 5.9939 5.9939 1.125 12 1.125ZM12 11.125C11.5168 11.125 11.125 11.5168 11.125 12V16C11.125 16.4832 11.5168 16.875 12 16.875C12.4832 16.875 12.875 16.4832 12.875 16V12C12.875 11.5168 12.4832 11.125 12 11.125ZM12 7.125C11.5168 7.125 11.125 7.51675 11.125 8C11.125 8.48325 11.5168 8.875 12 8.875H12.0098C12.493 8.875 12.8848 8.48325 12.8848 8C12.8848 7.51675 12.493 7.125 12.0098 7.125H12Z" fill="black"/></svg>`;

const MULTI_PATH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.125C18.0061 1.125 22.875 5.9939 22.875 12C22.875 18.0061 18.0061 22.875 12 22.875C5.9939 22.875 1.125 18.0061 1.125 12C1.125 5.9939 5.9939 1.125 12 1.125Z" fill="black"/><path d="M12 11.125C11.5168 11.125 11.125 11.5168 11.125 12V16C11.125 16.4832 11.5168 16.875 12 16.875C12.4832 16.875 12.875 16.4832 12.875 16V12C12.875 11.5168 12.4832 11.125 12 11.125Z" fill="black"/></svg>`;

const EVENODD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.875 18C22.875 18.7625 22.5724 19.494 22.0332 20.0332C21.494 20.5724 20.7625 20.875 20 20.875H4C3.2375 20.875 2.50596 20.5724 1.9668 20.0332C1.42763 19.494 1.125 18.7625 1.125 18V12.8945H22.875V18ZM6.00391 15.125C5.51929 15.1251 5.12695 15.5183 5.12695 16.0029C5.12709 16.4875 5.51937 16.8807 6.00391 16.8809C6.48856 16.8809 6.8817 16.4875 6.88184 16.0029C6.88184 15.5182 6.48864 15.125 6.00391 15.125ZM10.001 15.125C9.51624 15.125 9.12305 15.5182 9.12305 16.0029C9.12318 16.4875 9.51633 16.8809 10.001 16.8809C10.4856 16.8809 10.8788 16.4875 10.8789 16.0029C10.8789 15.5182 10.4857 15.125 10.001 15.125Z" fill="black"/><path d="M16.96 3.13184C17.425 3.16443 17.8765 3.30991 18.2744 3.55664C18.728 3.83795 19.094 4.24014 19.332 4.71777L22.5488 11.1445H1.4502L4.66797 4.71777C4.90598 4.24014 5.27205 3.83794 5.72559 3.55664C6.18007 3.27481 6.70448 3.12534 7.23926 3.125H16.7607L16.96 3.13184Z" fill="black"/></svg>`;

const MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><mask id="m"><rect width="24" height="24" fill="white"/><path d="M6 6L18 18" stroke="black" stroke-width="1.75"/></mask></defs><rect width="24" height="24" fill="black" mask="url(#m)"/></svg>`;

const WEIGHT_IDS = ['Ultralight-S', 'Regular-S', 'Black-S'];

const PREFIX = 'esds';

function createOptions(inputDir: string, outputDir: string): ConvertSvgToSymbolsetOptions {
  return {
    inputDirectory: inputDir,
    outputDirectory: outputDir,
    prefix: PREFIX,
    logger: Logger.root(),
  };
}

function parseOutputSvg(svgStr: string): OrderedNode[] {
  const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
  return parser.parse(svgStr);
}

function findSymbolsGroup(parsed: OrderedNode[]): OrderedNode | undefined {
  const svgRoot = parsed.find((node: OrderedNode) =>
    Object.prototype.hasOwnProperty.call(node, 'svg'),
  );
  if (!svgRoot) return undefined;

  const children = svgRoot['svg'] as OrderedNode[];
  if (!Array.isArray(children)) return undefined;

  return children.find((child: OrderedNode) => {
    const attrs = child[':@'];
    return attrs !== undefined && attrs['@_id'] === 'Symbols';
  });
}

function findWeightGroups(
  parsed: OrderedNode[],
): Record<string, { pathData: string; paths: OrderedNode[] }> {
  const symbolsGroup = findSymbolsGroup(parsed);
  if (!symbolsGroup) throw new Error('No Symbols group found');

  const weightGroups = symbolsGroup['g'] as OrderedNode[];
  if (!Array.isArray(weightGroups)) throw new Error('Symbols group has no children');

  const result: Record<string, { pathData: string; paths: OrderedNode[] }> = {};

  for (const group of weightGroups) {
    const attrs = group[':@'];
    if (!attrs || !attrs['@_id']) continue;

    const id = attrs['@_id'];
    if (!WEIGHT_IDS.includes(id)) continue;

    const children = group['g'] as OrderedNode[] | undefined;
    if (!Array.isArray(children)) continue;

    const firstPathAttrs = children.find((p) => p[':@'])?.[':@'];
    const pathData = firstPathAttrs?.['@_d'] ?? '';

    result[id] = { pathData, paths: children };
  }

  return result;
}

describe('convertSvgToSymbolset', () => {
  let tempDir: string;
  let inputDir: string;
  let outputDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'sf-symbols-test-'));
    inputDir = join(tempDir, 'input');
    outputDir = join(tempDir, 'output');
    await mkdir(inputDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('generates root Contents.json with correct schema', async () => {
    await writeFile(join(inputDir, 'test-icon.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const contentsPath = join(outputDir, 'Icons.xcassets', 'Contents.json');
    const contents = JSON.parse(await readFile(contentsPath, 'utf-8'));

    expect(contents).toEqual({ info: { author: 'xcode', version: 1 } });
  });

  it('generates 3 master weights (Ultralight-S, Regular-S, Black-S)', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    expect(Object.keys(weightGroups)).toHaveLength(3);
    expect(weightGroups['Ultralight-S']).toBeDefined();
    expect(weightGroups['Regular-S']).toBeDefined();
    expect(weightGroups['Black-S']).toBeDefined();
  });

  it('uses the Apple variable template with correct viewBox and structure', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('viewBox="0 0 3300 2200"');
    expect(svgStr).toContain('<!DOCTYPE svg');
    expect(svgStr).toContain('Generator: Apple Native CoreSVG');
    expect(svgStr).toContain('id="Notes"');
    expect(svgStr).toContain('id="template-version"');
    expect(svgStr).toContain('Template v.7.0');
    expect(svgStr).toContain('Requires Xcode 26 or greater');
    expect(svgStr).toContain('Generated from symbol');
    expect(svgStr).toContain('Typeset at 100.0 points');
    expect(svgStr).toContain('id="Guides"');
    expect(svgStr).toContain('id="Baseline-S"');
    expect(svgStr).toContain('id="Capline-S"');
    expect(svgStr).toContain('id="Baseline-M"');
    expect(svgStr).toContain('id="Capline-M"');
    expect(svgStr).toContain('id="Baseline-L"');
    expect(svgStr).toContain('id="Capline-L"');
    expect(svgStr).toContain('id="H-reference"');
    expect(svgStr).toContain('id="Symbols"');
  });

  it('includes left and right margins for all 3 weights', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('left-margin-Ultralight-S');
    expect(svgStr).toContain('right-margin-Ultralight-S');
    expect(svgStr).toContain('left-margin-Regular-S');
    expect(svgStr).toContain('right-margin-Regular-S');
    expect(svgStr).toContain('left-margin-Black-S');
    expect(svgStr).toContain('right-margin-Black-S');
  });

  it('includes 3 H-reference guides (one per scale: S, M, L)', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    const hRefMatches = svgStr.match(/id="H-reference"/g);
    expect(hRefMatches).not.toBeNull();
    expect(hRefMatches!.length).toBe(3);
  });

  it('includes the SFSymbolsPreviewWireframe style', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('SFSymbolsPreviewWireframe');
    expect(svgStr).toContain('<style>');
  });

  it('applies class="SFSymbolsPreviewWireframe" to all paths', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();

      for (const node of group.paths) {
        const attrs = node[':@'];
        if (!attrs) continue;

        expect(attrs['@_class'], `weight ${weightId} path should have wireframe class`).toBe(
          'SFSymbolsPreviewWireframe',
        );
      }
    }
  });

  it('does not use stroke attributes on paths', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    const symbolsStart = svgStr.indexOf('<g id="Symbols">');
    const symbolsEnd = svgStr.lastIndexOf('</g>');
    const symbolsSection = svgStr.substring(symbolsStart, symbolsEnd);

    expect(symbolsSection).not.toContain('stroke="currentColor"');
    expect(symbolsSection).not.toContain('stroke="black"');
    expect(symbolsSection).not.toContain('stroke-width');
    expect(symbolsSection).not.toContain('stroke-linecap');
    expect(symbolsSection).not.toContain('stroke-linejoin');
  });

  it('uses identity transforms (matrix(1 0 0 1 ...) not scaled)', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('matrix(1 0 0 1');
    expect(svgStr).not.toContain('matrix(4.166667');
  });

  it('fill-based icons produce identical paths for all 3 weights', async () => {
    await writeFile(join(inputDir, 'circle.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-circle.symbolset`,
      `${PREFIX}-circle.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    expect(Object.keys(weightGroups)).toHaveLength(3);

    const ultra = weightGroups['Ultralight-S'].pathData;
    const regular = weightGroups['Regular-S'].pathData;
    const black = weightGroups['Black-S'].pathData;

    expect(ultra).toBe(regular);
    expect(regular).toBe(black);
  });

  it('multi-subpath fill icons (with holes) work correctly', async () => {
    await writeFile(join(inputDir, 'info.svg'), MULTI_SUBPATH_FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-info.symbolset`,
      `${PREFIX}-info.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();
      expect(group.paths.length).toBeGreaterThanOrEqual(1);
    }

    const ultra = weightGroups['Ultralight-S'].pathData;
    const regular = weightGroups['Regular-S'].pathData;
    const black = weightGroups['Black-S'].pathData;

    expect(ultra).toBe(regular);
    expect(regular).toBe(black);
  });

  it('multi-path SVGs produce one path element per source path', async () => {
    await writeFile(join(inputDir, 'multi.svg'), MULTI_PATH_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-multi.symbolset`,
      `${PREFIX}-multi.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();
      expect(group.paths).toHaveLength(2);
    }
  });

  it('evenodd fill-rule icons are preserved as-is', async () => {
    await writeFile(join(inputDir, 'hard-drive.svg'), EVENODD_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-hard-drive.symbolset`,
      `${PREFIX}-hard-drive.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();
      expect(group.paths.length).toBeGreaterThanOrEqual(1);
    }

    const ultra = weightGroups['Ultralight-S'].pathData;
    const regular = weightGroups['Regular-S'].pathData;
    const black = weightGroups['Black-S'].pathData;

    expect(ultra).toBe(regular);
    expect(regular).toBe(black);
  });

  it('generates per-symbol Contents.json with correct schema', async () => {
    await writeFile(join(inputDir, 'arrow-left.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const contentsPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-arrow-left.symbolset`,
      'Contents.json',
    );
    const contents = JSON.parse(await readFile(contentsPath, 'utf-8'));

    expect(contents).toEqual({
      symbols: [{ filename: `${PREFIX}-arrow-left.svg`, idiom: 'universal' }],
      info: { author: 'xcode', version: 1 },
    });
  });

  it('skips .mask.svg files', async () => {
    await writeFile(join(inputDir, 'circle-check-filled.svg'), FILL_SVG);
    await writeFile(join(inputDir, 'circle-check-filled.mask.svg'), MASK_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const { readdir } = await import('node:fs/promises');
    const symbolsets = await readdir(join(outputDir, 'Icons.xcassets'));

    expect(symbolsets).toContain(`${PREFIX}-circle-check-filled.symbolset`);
    expect(symbolsets).not.toContain(`${PREFIX}-circle-check-filled.mask.symbolset`);
    expect(symbolsets.filter((s) => s.endsWith('.symbolset'))).toHaveLength(1);
  });

  it('ignores non-svg files in the input directory', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);
    await writeFile(join(inputDir, 'heart.metadata.json'), '{"tags":[],"categories":[]}');

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const { readdir } = await import('node:fs/promises');
    const symbolsets = await readdir(join(outputDir, 'Icons.xcassets'));

    expect(symbolsets.filter((s) => s.endsWith('.symbolset'))).toHaveLength(1);
    expect(symbolsets).toContain(`${PREFIX}-heart.symbolset`);
  });

  it('uses the provided prefix for symbolset naming', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);

    await convertSvgToSymbolset({
      inputDirectory: inputDir,
      outputDirectory: outputDir,
      prefix: 'custom',
      logger: Logger.root(),
    });

    const { readdir } = await import('node:fs/promises');
    const symbolsets = await readdir(join(outputDir, 'Icons.xcassets'));

    expect(symbolsets).toContain('custom-heart.symbolset');
  });

  it('converts multiple SVG files in a single run', async () => {
    await writeFile(join(inputDir, 'heart.svg'), FILL_SVG);
    await writeFile(join(inputDir, 'arrow-left.svg'), FILL_SVG);
    await writeFile(join(inputDir, 'user.svg'), MULTI_SUBPATH_FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const { readdir } = await import('node:fs/promises');
    const symbolsets = await readdir(join(outputDir, 'Icons.xcassets'));

    expect(symbolsets.filter((s) => s.endsWith('.symbolset'))).toHaveLength(3);
    expect(symbolsets).toContain(`${PREFIX}-heart.symbolset`);
    expect(symbolsets).toContain(`${PREFIX}-arrow-left.symbolset`);
    expect(symbolsets).toContain(`${PREFIX}-user.symbolset`);
  });

  it('throws when no SVG files are found', async () => {
    await expect(convertSvgToSymbolset(createOptions(inputDir, outputDir))).rejects.toThrow(
      /No SVG files found/,
    );
  });

  it('transforms coordinates from 24px Y-down to 100pt Y-up', async () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12" fill="black"/></svg>`;
    await writeFile(join(inputDir, 'point.svg'), svg);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-point.symbolset`,
      `${PREFIX}-point.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    const regularPath = weightGroups['Regular-S'].pathData;
    const coordMatch = regularPath.match(/M\s+([\d.]+)\s+([-\d.]+)/);
    expect(coordMatch).toBeDefined();
    const x = parseFloat(coordMatch![1]);
    const y = parseFloat(coordMatch![2]);
    expect(x).toBeCloseTo(50, 1);
    expect(y).toBeCloseTo(-50, 1);
  });

  it('handles SVGs with no path elements gracefully', async () => {
    const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="0" y="0">hello</text></svg>`;
    await writeFile(join(inputDir, 'empty.svg'), emptySvg);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-empty.symbolset`,
      `${PREFIX}-empty.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('id="Symbols"');
    expect(svgStr).toContain('id="Ultralight-S"');
    expect(svgStr).toContain('id="Regular-S"');
    expect(svgStr).toContain('id="Black-S"');
  });

  it('handles SVGs with no inner content', async () => {
    const bareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>`;
    await writeFile(join(inputDir, 'bare.svg'), bareSvg);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-bare.symbolset`,
      `${PREFIX}-bare.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('id="Symbols"');
  });
});

describe('findGroupById', () => {
  it('returns undefined when no svg root exists in parsed nodes', () => {
    const parsed: OrderedNode[] = [{ notSvg: [] }];

    expect(findGroupById(parsed, 'Symbols')).toBeUndefined();
  });

  it('returns undefined when svg children is not an array', () => {
    const parsed: OrderedNode[] = [{ svg: 'not-an-array' }];

    expect(findGroupById(parsed, 'Symbols')).toBeUndefined();
  });

  it('returns undefined when the id is not found among svg children', () => {
    const parsed: OrderedNode[] = [{ svg: [{ g: [], ':@': { '@_id': 'Other' } }] }];

    expect(findGroupById(parsed, 'Symbols')).toBeUndefined();
  });

  it('finds the group by id', () => {
    const parsed: OrderedNode[] = [{ svg: [{ g: [], ':@': { '@_id': 'Symbols' } }] }];

    const result = findGroupById(parsed, 'Symbols');
    expect(result).toBeDefined();
    expect(result?.[':@']?.['@_id']).toBe('Symbols');
  });
});

describe('injectMastersIntoTemplate', () => {
  const FILL_SVG_LOCAL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.125" fill="black"/></svg>`;

  it('throws when no Symbols group is found', () => {
    const parsed: OrderedNode[] = [{ svg: [{ g: [], ':@': { '@_id': 'Notes' } }] }];

    expect(() => injectMastersIntoTemplate(parsed, FILL_SVG_LOCAL)).toThrow(
      'No <g id="Symbols"> found in Apple template.',
    );
  });

  it('throws when Symbols group has no child elements (g is not an array)', () => {
    const parsed: OrderedNode[] = [{ svg: [{ g: 'not-an-array', ':@': { '@_id': 'Symbols' } }] }];

    expect(() => injectMastersIntoTemplate(parsed, FILL_SVG_LOCAL)).toThrow(
      'Symbols group has no child elements.',
    );
  });

  it('skips groups without attrs, without id, or with non-master id', () => {
    const parsed: OrderedNode[] = [
      {
        svg: [
          {
            g: [
              { path: [], ':@': { '@_id': 'Unknown-Weight' } },
              { path: [] },
              { path: [], ':@': { '@_class': 'other' } },
              { g: [], ':@': { '@_id': 'Regular-S' } },
            ],
            ':@': { '@_id': 'Symbols' },
          },
        ],
      },
    ];

    expect(() => injectMastersIntoTemplate(parsed, FILL_SVG_LOCAL)).not.toThrow();
  });
});

describe('buildSymbolContentsJson', () => {
  it('produces correct schema with icon name and universal idiom', () => {
    const result = buildSymbolContentsJson('esds-heart');

    expect(result).toEqual({
      symbols: [{ filename: 'esds-heart.svg', idiom: 'universal' }],
      info: { author: 'xcode', version: 1 },
    });
  });
});
