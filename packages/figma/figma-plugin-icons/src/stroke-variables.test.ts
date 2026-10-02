import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyStrokeVariables,
  detectStrokeVariables,
  parseStrokeSizeFromName,
} from './stroke-variables.ts';
import { DEFAULT_STROKE_WEIGHTS, type StrokeConfig } from './tokens.ts';

describe('parseStrokeSizeFromName', () => {
  it.each([
    ['stroke/16', 16],
    ['stroke_20', 20],
    ['Stroke Width 24', 24],
    ['icon-stroke-40', 40],
  ])('extracts the size from %s', (name, expected) => {
    expect(parseStrokeSizeFromName(name)).toBe(expected);
  });

  it('rejects names without "stroke"', () => {
    expect(parseStrokeSizeFromName('width/24')).toBeNull();
  });

  it('rejects names whose first number is not an icon size', () => {
    expect(parseStrokeSizeFromName('stroke 2px')).toBeNull();
  });

  it('rejects names without digits', () => {
    expect(parseStrokeSizeFromName('stroke weight')).toBeNull();
  });
});

interface FakeVariable {
  readonly key: string;
  readonly name: string;
  readonly valuesByMode?: Record<string, unknown>;
}

function stubFigma(
  collections: { name: string; key: string }[],
  variablesByCollection: Record<string, FakeVariable[]>,
  variablesByKey: Record<string, FakeVariable>,
): void {
  vi.stubGlobal('figma', {
    teamLibrary: {
      getAvailableLibraryVariableCollectionsAsync: () => Promise.resolve(collections),
      getVariablesInLibraryCollectionAsync: (collectionKey: string) =>
        Promise.resolve(variablesByCollection[collectionKey] ?? []),
    },
    variables: {
      importVariableByKeyAsync: (key: string) => Promise.resolve(variablesByKey[key] ?? null),
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('detectStrokeVariables', () => {
  it('collects stroke variables with a known size from every collection', async () => {
    stubFigma(
      [
        { name: 'Icons', key: 'collection-1' },
        { name: 'Other', key: 'collection-2' },
      ],
      {
        'collection-1': [
          { key: 'key-16', name: 'stroke/16' },
          { key: 'key-20', name: 'stroke_20' },
          { key: 'key-ignore', name: 'padding/24' },
          { key: 'key-small', name: 'stroke 2px' },
        ],
        'collection-2': [{ key: 'key-32', name: 'Stroke Width 32' }],
      },
      {},
    );

    expect(await detectStrokeVariables()).toEqual([
      { name: 'stroke/16', size: 16, collection: 'Icons', key: 'key-16' },
      { name: 'stroke_20', size: 20, collection: 'Icons', key: 'key-20' },
      { name: 'Stroke Width 32', size: 32, collection: 'Other', key: 'key-32' },
    ]);
  });

  it('returns an empty list when collections are empty', async () => {
    stubFigma([], {}, {});
    expect(await detectStrokeVariables()).toEqual([]);
  });
});

describe('applyStrokeVariables', () => {
  it('applies the first mode value of each resolvable variable', async () => {
    stubFigma(
      [],
      {},
      {
        'key-16': { key: 'key-16', name: 'stroke/16', valuesByMode: { light: 1.5, dark: 2 } },
        'key-20': { key: 'key-20', name: 'stroke_20', valuesByMode: { light: 'thick' } },
      },
    );

    const result = await applyStrokeVariables(
      [
        { name: 'stroke/16', size: 16, collection: 'Icons', key: 'key-16' },
        { name: 'stroke_20', size: 20, collection: 'Icons', key: 'key-20' },
      ],
      { ...DEFAULT_STROKE_WEIGHTS },
    );

    expect(result[16]).toBe(1.5);
    expect(result[20]).toBe(DEFAULT_STROKE_WEIGHTS[20]);
  });

  it('skips variables that cannot be resolved', async () => {
    stubFigma([], {}, {});
    const config: StrokeConfig = { ...DEFAULT_STROKE_WEIGHTS };

    const result = await applyStrokeVariables(
      [{ name: 'stroke/16', size: 16, collection: 'Icons', key: 'missing' }],
      config,
    );

    expect(result).toEqual(config);
  });

  it('skips variables throwing during resolution', async () => {
    vi.stubGlobal('figma', {
      variables: {
        importVariableByKeyAsync: () => Promise.reject(new Error('boom')),
      },
    });

    const result = await applyStrokeVariables(
      [{ name: 'stroke/16', size: 16, collection: 'Icons', key: 'key-16' }],
      { ...DEFAULT_STROKE_WEIGHTS },
    );

    expect(result[16]).toBe(DEFAULT_STROKE_WEIGHTS[16]);
  });

  it('skips variables without modes', async () => {
    stubFigma([], {}, { 'key-16': { key: 'key-16', name: 'stroke/16', valuesByMode: {} } });

    const result = await applyStrokeVariables(
      [{ name: 'stroke/16', size: 16, collection: 'Icons', key: 'key-16' }],
      { ...DEFAULT_STROKE_WEIGHTS },
    );

    expect(result[16]).toBe(DEFAULT_STROKE_WEIGHTS[16]);
  });

  it('skips non-numeric mode values', async () => {
    stubFigma(
      [],
      {},
      { 'key-16': { key: 'key-16', name: 'stroke/16', valuesByMode: { light: 'bold' } } },
    );

    const result = await applyStrokeVariables(
      [{ name: 'stroke/16', size: 16, collection: 'Icons', key: 'key-16' }],
      { ...DEFAULT_STROKE_WEIGHTS },
    );

    expect(result[16]).toBe(DEFAULT_STROKE_WEIGHTS[16]);
  });
});
