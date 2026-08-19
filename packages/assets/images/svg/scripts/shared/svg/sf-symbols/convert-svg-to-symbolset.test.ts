import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import {
  convertSvgToSymbolset,
  type ConvertSvgToSymbolsetOptions,
} from './convert-svg-to-symbolset.ts';
import { BASE_STROKE_WIDTH, WEIGHT_MULTIPLIERS } from './weight-multipliers.ts';

const STROKE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const FILL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.125C18.0061 1.125 22.875 5.9939 22.875 12C22.875 18.0061 18.0061 22.875 12 22.875C5.9939 22.875 1.125 18.0061 1.125 12C1.125 5.9939 5.9939 1.125 12 1.125Z" fill="black"/></svg>`;

const MULTI_ELEMENT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="black" stroke-width="1.75"/><circle cx="12" cy="12" r="5" stroke="black" stroke-width="1.75"/><line x1="0" y1="0" x2="24" y2="24" stroke="black" stroke-width="1.75"/></svg>`;

const MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><mask id="m"><rect width="24" height="24" fill="white"/><path d="M6 6L18 18" stroke="black" stroke-width="1.75"/></mask></defs><rect width="24" height="24" fill="black" mask="url(#m)"/></svg>`;

const ZERO_HEIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M5 12H19" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ZERO_WIDTH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M12 5V19" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const MIXED_ZERO_AND_NORMAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M5 12H19" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const WEIGHT_IDS = Object.keys(WEIGHT_MULTIPLIERS);

const PREFIX = 'esds';

function createOptions(inputDir: string, outputDir: string): ConvertSvgToSymbolsetOptions {
  return {
    inputDirectory: inputDir,
    outputDirectory: outputDir,
    prefix: PREFIX,
    logger: Logger.root(),
  };
}

type OrderedNode = { [key: string]: unknown; ':@'?: Record<string, string> };

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
): Record<string, { strokeWidth: string; paths: OrderedNode[] }> {
  const symbolsGroup = findSymbolsGroup(parsed);
  if (!symbolsGroup) throw new Error('No Symbols group found');

  const weightGroups = symbolsGroup['g'] as OrderedNode[];
  if (!Array.isArray(weightGroups)) throw new Error('Symbols group has no children');

  const result: Record<string, { strokeWidth: string; paths: OrderedNode[] }> = {};

  for (const group of weightGroups) {
    const attrs = group[':@'];
    if (!attrs || !attrs['@_id']) continue;

    const id = attrs['@_id'];
    if (!WEIGHT_IDS.includes(id)) continue;

    const paths = group['g'] as OrderedNode[];
    if (!Array.isArray(paths)) continue;

    const firstPathAttrs = paths.find((p) => p[':@'])?.[':@'];
    const strokeWidth = firstPathAttrs?.['@_stroke-width'] ?? '';

    result[id] = { strokeWidth, paths };
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
    await writeFile(join(inputDir, 'test-icon.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const contentsPath = join(outputDir, 'Icons.xcassets', 'Contents.json');
    const contents = JSON.parse(await readFile(contentsPath, 'utf-8'));

    expect(contents).toEqual({ info: { author: 'xcode', version: 1 } });
  });

  it('converts a stroke-based SVG with all 9 weights and correct stroke-widths', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

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

    expect(Object.keys(weightGroups)).toHaveLength(9);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();

      const expectedWidth = (BASE_STROKE_WIDTH * WEIGHT_MULTIPLIERS[weightId]).toFixed(2);
      expect(group.strokeWidth, `weight ${weightId} stroke-width`).toBe(expectedWidth);
    }
  });

  it('uses the real Apple template with correct viewBox and structure', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('viewBox="0 0 3300 2200"');
    expect(svgStr).toContain('id="Notes"');
    expect(svgStr).toContain('id="template-version"');
    expect(svgStr).toContain('Template v.7.0');
    expect(svgStr).toContain('id="Guides"');
    expect(svgStr).toContain('id="Baseline-S"');
    expect(svgStr).toContain('id="Baseline-M"');
    expect(svgStr).toContain('id="Baseline-L"');
    expect(svgStr).toContain('id="Capline-S"');
    expect(svgStr).toContain('id="Capline-M"');
    expect(svgStr).toContain('id="Capline-L"');
    expect(svgStr).toContain('id="Symbols"');
  });

  it('includes the SFSymbolsPreviewWireframe style for SF Symbols app preview', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

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

  it('preserves all child elements from the source SVG', async () => {
    await writeFile(join(inputDir, 'multi.svg'), MULTI_ELEMENT_SVG);

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

    const regularGroup = weightGroups['Regular-M'];
    expect(regularGroup).toBeDefined();

    const paths = regularGroup.paths;
    expect(paths.length).toBeGreaterThanOrEqual(3);

    const elementTags = paths.map((node) => Object.keys(node).filter((k) => k !== ':@'));
    expect(elementTags).toContainEqual(['path']);
    expect(elementTags).toContainEqual(['circle']);
    expect(elementTags).toContainEqual(['line']);
  });

  it('strips stroke and stroke-width from inner paths and uses currentColor', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('stroke="currentColor"');
    expect(svgStr).not.toContain('stroke="black"');
  });

  it('sets stroke-width directly on paths, not on wrapper groups', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

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

    const regularGroup = weightGroups['Regular-M'];
    const paths = regularGroup.paths;

    for (const node of paths) {
      const attrs = node[':@'];
      if (!attrs) continue;

      expect(attrs['@_stroke-width']).toBe('1.75');
      expect(attrs['@_stroke']).toBe('currentColor');
      expect(attrs['@_fill']).toBe('none');
    }
  });

  it('puts paths as direct children of weight groups (no wrapper <g>)', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const symbolsGroup = findSymbolsGroup(parsed);
    if (!symbolsGroup) throw new Error('No Symbols group');

    const weightGroups = symbolsGroup['g'] as OrderedNode[];
    const regularGroup = weightGroups.find((g) => g[':@']?.['@_id'] === 'Regular-M');
    if (!regularGroup) throw new Error('No Regular-M group');

    const children = regularGroup['g'] as OrderedNode[];
    expect(Array.isArray(children)).toBe(true);

    for (const child of children) {
      const tag = Object.keys(child).find((k) => k !== ':@');
      expect(tag, 'should be a path element, not a nested <g>').toBe('path');
    }
  });

  it('preserves fill-based paths with fill="currentColor" and no stroke across all 9 weights', async () => {
    await writeFile(join(inputDir, 'circle-check-filled.svg'), FILL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-circle-check-filled.symbolset`,
      `${PREFIX}-circle-check-filled.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    expect(Object.keys(weightGroups)).toHaveLength(9);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();

      const paths = group.paths;
      expect(paths.length).toBeGreaterThanOrEqual(1);

      for (const node of paths) {
        const attrs = node[':@'];
        if (!attrs) continue;

        expect(attrs['@_fill'], `weight ${weightId} should have fill="currentColor"`).toBe(
          'currentColor',
        );
        expect(attrs['@_stroke'], `weight ${weightId} should not have stroke`).toBeUndefined();
        expect(
          attrs['@_stroke-width'],
          `weight ${weightId} should not have stroke-width`,
        ).toBeUndefined();
      }
    }
  });

  it('preserves fill paths in mixed stroke+fill SVGs per-path', async () => {
    const mixedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1.125C18.0061 1.125 22.875 5.9939 22.875 12C22.875 18.0061 18.0061 22.875 12 22.875C5.9939 22.875 1.125 18.0061 1.125 12C1.125 5.9939 5.9939 1.125 12 1.125Z" fill="black"/></svg>`;
    await writeFile(join(inputDir, 'mixed-stroke-fill.svg'), mixedSvg);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-mixed-stroke-fill.symbolset`,
      `${PREFIX}-mixed-stroke-fill.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    const regularGroup = weightGroups['Regular-M'];
    expect(regularGroup).toBeDefined();

    const paths = regularGroup.paths;
    expect(paths).toHaveLength(2);

    const strokeAttrs = paths[0][':@'];
    expect(strokeAttrs).toBeDefined();
    expect(strokeAttrs!['@_stroke']).toBe('currentColor');
    expect(strokeAttrs!['@_fill']).toBe('none');
    expect(strokeAttrs!['@_stroke-width']).toBe('1.75');

    const fillAttrs = paths[1][':@'];
    expect(fillAttrs).toBeDefined();
    expect(fillAttrs!['@_fill']).toBe('currentColor');
    expect(fillAttrs!['@_stroke']).toBeUndefined();
    expect(fillAttrs!['@_stroke-width']).toBeUndefined();
  });

  it('preserves fill paths in icons without -filled suffix (e.g. dots)', async () => {
    const dotsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M9 17.125C10.0355 17.125 10.875 17.9645 10.875 19C10.875 20.0355 10.0355 20.875 9 20.875C7.96447 20.875 7.125 20.0355 7.125 19C7.125 17.9645 7.96447 17.125 9 17.125Z" fill="black"/><path d="M15 17.125C16.0355 17.125 16.875 17.9645 16.875 19C16.875 20.0355 16.0355 20.875 15 20.875C13.9645 20.875 13.125 20.0355 13.125 19C13.125 17.9645 13.9645 17.125 15 17.125Z" fill="black"/></svg>`;
    await writeFile(join(inputDir, 'dots-six.svg'), dotsSvg);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-dots-six.symbolset`,
      `${PREFIX}-dots-six.svg`,
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

        expect(attrs['@_fill'], `weight ${weightId} should have fill="currentColor"`).toBe(
          'currentColor',
        );
        expect(attrs['@_stroke'], `weight ${weightId} should not have stroke`).toBeUndefined();
      }
    }
  });

  it('generates per-symbol Contents.json with correct schema', async () => {
    await writeFile(join(inputDir, 'arrow-left.svg'), STROKE_SVG);

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
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);
    await writeFile(join(inputDir, 'heart.metadata.json'), '{"tags":[],"categories":[]}');

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const { readdir } = await import('node:fs/promises');
    const symbolsets = await readdir(join(outputDir, 'Icons.xcassets'));

    expect(symbolsets.filter((s) => s.endsWith('.symbolset'))).toHaveLength(1);
    expect(symbolsets).toContain(`${PREFIX}-heart.symbolset`);
  });

  it('uses the provided prefix for symbolset naming', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

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
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);
    await writeFile(join(inputDir, 'arrow-left.svg'), STROKE_SVG);
    await writeFile(join(inputDir, 'user.svg'), FILL_SVG);

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

  it('includes stroke-linecap and stroke-linejoin round on paths', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('stroke-linecap="round"');
    expect(svgStr).toContain('stroke-linejoin="round"');
  });

  it('uses positive scale factor (no Y-flip) in group transforms', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('matrix(4.166667 0 0 4.166667');
    expect(svgStr).not.toContain('-4.166667');
  });

  it('includes left and right margins for Regular-M', async () => {
    await writeFile(join(inputDir, 'heart.svg'), STROKE_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-heart.symbolset`,
      `${PREFIX}-heart.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');

    expect(svgStr).toContain('left-margin-Regular-M');
    expect(svgStr).toContain('right-margin-Regular-M');
  });

  it('converts zero-bbox horizontal paths to filled capsule outlines', async () => {
    await writeFile(join(inputDir, 'minus.svg'), ZERO_HEIGHT_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-minus.symbolset`,
      `${PREFIX}-minus.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    const regularGroup = weightGroups['Regular-M'];
    expect(regularGroup).toBeDefined();

    const paths = regularGroup.paths;
    expect(paths).toHaveLength(1);

    const attrs = paths[0][':@'];
    expect(attrs).toBeDefined();
    expect(attrs!['@_fill']).toBe('currentColor');
    expect(attrs!['@_stroke']).toBeUndefined();
    expect(attrs!['@_stroke-width']).toBeUndefined();
    expect(attrs!['@_stroke-linecap']).toBeUndefined();
    expect(attrs!['@_stroke-linejoin']).toBeUndefined();

    const d = attrs!['@_d'];
    expect(d).toContain('A');
    expect(d).toContain('Z');
  });

  it('converts zero-bbox vertical paths to filled capsule outlines', async () => {
    await writeFile(join(inputDir, 'divider.svg'), ZERO_WIDTH_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-divider.symbolset`,
      `${PREFIX}-divider.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    const regularGroup = weightGroups['Regular-M'];
    expect(regularGroup).toBeDefined();

    const paths = regularGroup.paths;
    expect(paths).toHaveLength(1);

    const attrs = paths[0][':@'];
    expect(attrs).toBeDefined();
    expect(attrs!['@_fill']).toBe('currentColor');
    expect(attrs!['@_stroke']).toBeUndefined();

    const d = attrs!['@_d'];
    expect(d).toContain('A');
    expect(d).toContain('Z');
  });

  it('only converts zero-bbox paths, leaves normal paths stroke-based in mixed SVG', async () => {
    await writeFile(join(inputDir, 'mixed.svg'), MIXED_ZERO_AND_NORMAL_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-mixed.symbolset`,
      `${PREFIX}-mixed.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    const regularGroup = weightGroups['Regular-M'];
    expect(regularGroup).toBeDefined();

    const paths = regularGroup.paths;
    expect(paths).toHaveLength(2);

    const firstAttrs = paths[0][':@'];
    expect(firstAttrs).toBeDefined();
    expect(firstAttrs!['@_fill']).toBe('currentColor');
    expect(firstAttrs!['@_stroke']).toBeUndefined();

    const secondAttrs = paths[1][':@'];
    expect(secondAttrs).toBeDefined();
    expect(secondAttrs!['@_stroke']).toBe('currentColor');
    expect(secondAttrs!['@_fill']).toBe('none');
    expect(secondAttrs!['@_stroke-width']).toBe('1.75');
  });

  it('applies correct capsule radius for zero-bbox paths across all weights', async () => {
    await writeFile(join(inputDir, 'minus.svg'), ZERO_HEIGHT_SVG);

    await convertSvgToSymbolset(createOptions(inputDir, outputDir));

    const svgPath = join(
      outputDir,
      'Icons.xcassets',
      `${PREFIX}-minus.symbolset`,
      `${PREFIX}-minus.svg`,
    );
    const svgStr = await readFile(svgPath, 'utf-8');
    const parsed = parseOutputSvg(svgStr);
    const weightGroups = findWeightGroups(parsed);

    for (const weightId of WEIGHT_IDS) {
      const group = weightGroups[weightId];
      expect(group, `weight ${weightId} should exist`).toBeDefined();

      const paths = group.paths;
      expect(paths).toHaveLength(1);

      const attrs = paths[0][':@'];
      expect(attrs).toBeDefined();
      expect(attrs!['@_fill'], `weight ${weightId} should be filled`).toBe('currentColor');
      expect(attrs!['@_stroke'], `weight ${weightId} should not have stroke`).toBeUndefined();

      const expectedWidth = BASE_STROKE_WIDTH * WEIGHT_MULTIPLIERS[weightId];
      const d = attrs!['@_d'];
      const radiusMatch = d.match(/A([\d.]+)\s+([\d.]+)/);
      expect(radiusMatch, `weight ${weightId} should have arc radius`).toBeDefined();
      const radius = parseFloat(radiusMatch![1]);
      expect(radius).toBeCloseTo(expectedWidth / 2, 1);
    }
  });
});
