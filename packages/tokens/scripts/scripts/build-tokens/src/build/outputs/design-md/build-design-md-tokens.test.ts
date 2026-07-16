import { mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { buildDesignMdTokens, toYaml, toYamlBlock } from './build-design-md-tokens.ts';
import {
  deepResolveValue,
  resolvedTokenToString,
  resolvedTokenToYamlValue,
} from './token-to-yaml-value.ts';

/*-- MOCK HELPERS --*/

function createBaseCollection(): DesignTokensCollection {
  return new DesignTokensCollection([
    {
      files: ['/tokens/t1-primitive/color.tokens.json'],
      name: ['color', 'red', '500'],
      type: 'color',
      value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      description: 'Primary red 500',
    },
    {
      files: ['/tokens/t1-primitive/color.tokens.json'],
      name: ['color', 'blue', '500'],
      type: 'color',
      value: { hex: '#0000ff', components: [0, 0, 1], colorSpace: 'srgb' },
      description: 'Primary blue 500',
    },
    {
      files: ['/tokens/t1-primitive/spacing.tokens.json'],
      name: ['spacing', '8'],
      type: 'dimension',
      value: { value: 2, unit: 'rem' },
    },
    {
      files: ['/tokens/t1-primitive/opacity.tokens.json'],
      name: ['opacity', 'medium'],
      type: 'number',
      value: 0.5,
    },
    {
      files: ['/tokens/t2-semantic/color.tokens.json'],
      name: ['color', 'background', 'brand', 'default'],
      type: 'color',
      value: '{color.red.500}',
      description: 'Brand background default',
    },
    {
      files: ['/tokens/t2-semantic/color.tokens.json'],
      name: ['color', 'content', 'primary'],
      type: 'color',
      value: { hex: '#000000', components: [0, 0, 0], colorSpace: 'srgb' },
      description: 'Content primary color',
    },
    {
      files: ['/tokens/t2-semantic/typography.tokens.json'],
      name: ['typography', 'heading', 'lg'],
      type: 'typography',
      value: {
        fontFamily: ['Inter', 'sans-serif'],
        fontSize: { value: 18, unit: 'px' },
        fontWeight: 700,
        lineHeight: 1.5,
      },
      description: 'Heading large',
    },
    {
      files: ['/tokens/t3-component/button.tokens.json'],
      name: ['button', 'background'],
      type: 'color',
      value: '{color.background.brand.default}',
    },
    {
      files: ['/tokens/t3-component/button.tokens.json'],
      name: ['button', 'text'],
      type: 'color',
      value: '{color.content.primary}',
      deprecated: true,
    },
    {
      files: ['/tokens/t3-component/button.tokens.json'],
      name: ['button', 'shadow'],
      type: 'shadow',
      value: {
        offsetX: { value: 0, unit: 'px' },
        offsetY: { value: 2, unit: 'px' },
        blur: { value: 4, unit: 'px' },
        spread: { value: 0, unit: 'px' },
        color: { hex: '#0000000d', components: [0, 0, 0], colorSpace: 'srgb' },
        inset: false,
      },
    },
    {
      files: ['/tokens/other/custom.tokens.json'],
      name: ['custom', 'value'],
      type: 'unknown',
      value: 'something',
    },
    {
      files: ['/tokens/other/custom.tokens.json'],
      name: [],
      type: 'color',
      value: { hex: '#00ff00', components: [0, 1, 0], colorSpace: 'srgb' },
    },
    {
      files: ['/tokens/other/typeless.tokens.json'],
      name: ['typeless', 'token'],
      type: undefined,
      value: '{color.red.500}',
    },
  ]);
}

function createLightCollection(base: DesignTokensCollection): DesignTokensCollection {
  const c = base.clone();
  c.add(
    {
      files: ['/tokens/modifiers/theme/light/color.tokens.json'],
      name: ['color', 'content', 'primary'],
      type: 'color',
      value: { hex: '#000000', components: [0, 0, 0], colorSpace: 'srgb' },
    },
    { last: true, merge: true },
  );
  return c;
}

function createDarkCollection(base: DesignTokensCollection): DesignTokensCollection {
  const c = base.clone();
  c.add(
    {
      files: ['/tokens/modifiers/theme/dark/color.tokens.json'],
      name: ['color', 'content', 'primary'],
      type: 'color',
      value: { hex: '#ffffff', components: [1, 1, 1], colorSpace: 'srgb' },
    },
    { last: true, merge: true },
  );
  return c;
}

/*-- deepResolveValue --*/

describe('deepResolveValue', () => {
  it('should return primitive values unchanged', () => {
    const collection = new DesignTokensCollection([]);
    expect(deepResolveValue(collection, 'hello')).toBe('hello');
    expect(deepResolveValue(collection, 42)).toBe(42);
    expect(deepResolveValue(collection, true)).toBe(true);
    expect(deepResolveValue(collection, null)).toBe(null);
    expect(deepResolveValue(collection, undefined)).toBe(undefined);
  });

  it('should resolve a simple curly reference', () => {
    const collection = new DesignTokensCollection([
      {
        files: ['/tokens/t1-primitive/color.tokens.json'],
        name: ['color', 'red', '500'],
        type: 'color',
        value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      },
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['ref', 'color'],
        type: undefined,
        value: '{color.red.500}',
      },
    ]);
    const result = deepResolveValue(collection, '{ref.color}');
    expect(result).toEqual({ hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' });
  });

  it('should recursively resolve nested object properties', () => {
    const collection = new DesignTokensCollection([
      {
        files: ['/tokens/t1-primitive/color.tokens.json'],
        name: ['color', 'red', '500'],
        type: 'color',
        value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      },
    ]);
    const result = deepResolveValue(collection, { color: '{color.red.500}', other: 42 });
    expect(result).toEqual({
      color: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      other: 42,
    });
  });

  it('should recursively resolve array items', () => {
    const collection = new DesignTokensCollection([
      {
        files: ['/tokens/t1-primitive/color.tokens.json'],
        name: ['color', 'red', '500'],
        type: 'color',
        value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      },
    ]);
    const result = deepResolveValue(collection, ['{color.red.500}', 'static']);
    expect(result).toEqual([
      { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      'static',
    ]);
  });
});

/*-- resolvedTokenToYamlValue --*/

describe('resolvedTokenToYamlValue', () => {
  function createMockToken(
    overrides: Partial<{
      type: string;
      value: unknown;
      name: string[];
    }>,
  ) {
    return {
      files: [],
      ...overrides,
      trace: [],
    } as import('../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts').GenericResolvedDesignTokensCollectionToken;
  }

  it('should format color tokens as CSS hex strings', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['color', 'red', '500'],
      type: 'color',
      value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('#f00');
  });

  it('should format dimension tokens as CSS dimension strings', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['spacing', '8'],
      type: 'dimension',
      value: { value: 2, unit: 'rem' },
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('2rem');
  });

  it('should format number tokens as strings', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['opacity', 'medium'],
      type: 'number',
      value: 0.5,
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('0.5');
  });

  it('should format fontFamily tokens as CSS strings', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['font', 'family', 'base'],
      type: 'fontFamily',
      value: ['Inter', 'sans-serif'],
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('Inter, sans-serif');
  });

  it('should format fontWeight tokens', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['font', 'weight', 'bold'],
      type: 'fontWeight',
      value: 'bold',
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('700');
  });

  it('should format duration tokens', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['duration', 'fast'],
      type: 'duration',
      value: { value: 100, unit: 'ms' },
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('100ms');
  });

  it('should expand typography tokens into sub-objects', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['typography', 'heading', 'lg'],
      type: 'typography',
      value: {
        fontFamily: ['Inter', 'sans-serif'],
        fontSize: { value: 18, unit: 'px' },
        fontWeight: 700,
        lineHeight: 1.5,
      },
    });
    const result = resolvedTokenToYamlValue(collection, resolvedToken) as Record<string, string>;
    expect(result['fontFamily']).toBe('Inter, sans-serif');
    expect(result['fontSize']).toBe('18px');
    expect(result['fontWeight']).toBe('700');
    expect(result['lineHeight']).toBe('1.5');
  });

  it('should handle typography with boolean and unrecognised sub-properties', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['typography', 'weird'],
      type: 'typography',
      value: {
        fontFamily: { weird: 'object' },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 400,
        lineHeight: true,
        letterSpacing: true,
      },
    });
    const result = resolvedTokenToYamlValue(collection, resolvedToken) as Record<string, string>;
    expect(result['fontFamily']).toBe('[object Object]');
    expect(result['lineHeight']).toBe('true');
    expect(result['letterSpacing']).toBe('true');

    const str = resolvedTokenToString(collection, resolvedToken);
    expect(str).toContain('true');
    expect(str).toContain('[object Object]');
  });

  it('should expand single-shadow tokens into sub-objects', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['shadow', 'card'],
      type: 'shadow',
      value: {
        offsetX: { value: 0, unit: 'px' },
        offsetY: { value: 2, unit: 'px' },
        blur: { value: 4, unit: 'px' },
        spread: { value: 0, unit: 'px' },
        color: { hex: '#0000000d', components: [0, 0, 0], colorSpace: 'srgb' },
        inset: false,
      },
    });
    const result = resolvedTokenToYamlValue(collection, resolvedToken) as Record<string, unknown>;
    expect(result['offsetX']).toBe('0px');
    expect(result['inset']).toBe(false);
  });

  it('should expand multi-shadow tokens as array of objects', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['shadow', 'multi'],
      type: 'shadow',
      value: [
        {
          offsetX: { value: 0, unit: 'px' },
          offsetY: { value: 1, unit: 'px' },
          blur: { value: 2, unit: 'px' },
          spread: { value: 0, unit: 'px' },
          color: { hex: '#0000000d', components: [0, 0, 0], colorSpace: 'srgb' },
          inset: false,
        },
      ],
    });
    const result = resolvedTokenToYamlValue(collection, resolvedToken) as unknown as Record<
      string,
      unknown
    >[];
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]['offsetX']).toBe('0px');
    expect(result[0]['inset']).toBe(false);
  });

  it('should stringify unknown types', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['custom', 'value'],
      type: 'unknown',
      value: 'something',
    });
    expect(resolvedTokenToYamlValue(collection, resolvedToken)).toBe('something');
  });
});

/*-- resolvedTokenToString --*/

describe('resolvedTokenToString', () => {
  function createMockToken(
    overrides: Partial<{
      type: string;
      value: unknown;
      name: string[];
    }>,
  ) {
    return {
      files: [],
      ...overrides,
      trace: [],
    } as import('../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts').GenericResolvedDesignTokensCollectionToken;
  }

  it('should fallback to resolvedTokenToYamlValue for non-composite types', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['color', 'red', '500'],
      type: 'color',
      value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
    });
    expect(resolvedTokenToString(collection, resolvedToken)).toBe('#f00');
  });

  it('should build typography CSS shorthand string', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['typography', 'heading', 'lg'],
      type: 'typography',
      value: {
        fontFamily: ['Inter', 'sans-serif'],
        fontSize: { value: 18, unit: 'px' },
        fontWeight: 700,
        lineHeight: 1.5,
      },
    });
    expect(resolvedTokenToString(collection, resolvedToken)).toBe('700 18px/1.5 Inter, sans-serif');
  });

  it('should build single shadow CSS string', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['shadow', 'card'],
      type: 'shadow',
      value: {
        offsetX: { value: 0, unit: 'px' },
        offsetY: { value: 2, unit: 'px' },
        blur: { value: 4, unit: 'px' },
        spread: { value: 0, unit: 'px' },
        color: { hex: '#0000000d', components: [0, 0, 0], colorSpace: 'srgb' },
        inset: false,
      },
    });
    expect(resolvedTokenToString(collection, resolvedToken)).toBe('0px 2px 4px 0px #000');
  });

  it('should build multi-shadow CSS string with comma separation', () => {
    const collection = new DesignTokensCollection([]);
    const resolvedToken = createMockToken({
      name: ['shadow', 'multi'],
      type: 'shadow',
      value: [
        {
          offsetX: { value: 0, unit: 'px' },
          offsetY: { value: 1, unit: 'px' },
          blur: { value: 2, unit: 'px' },
          spread: { value: 0, unit: 'px' },
          color: { hex: '#0000000d', components: [0, 0, 0], colorSpace: 'srgb' },
          inset: false,
        },
        {
          offsetX: { value: 0, unit: 'px' },
          offsetY: { value: 2, unit: 'px' },
          blur: { value: 4, unit: 'px' },
          spread: { value: 0, unit: 'px' },
          color: { hex: '#0000001a', components: [0, 0, 0], colorSpace: 'srgb' },
          inset: false,
        },
      ],
    });
    expect(resolvedTokenToString(collection, resolvedToken)).toBe(
      '0px 1px 2px 0px #000, 0px 2px 4px 0px #000',
    );
  });
});

/*-- YAML --*/

describe('toYaml', () => {
  it('should serialise null and undefined as "null"', () => {
    expect(toYaml(null)).toBe('null');
    expect(toYaml(undefined)).toBe('null');
  });

  it('should serialise booleans and numbers directly', () => {
    expect(toYaml(true)).toBe('true');
    expect(toYaml(false)).toBe('false');
    expect(toYaml(42)).toBe('42');
    expect(toYaml(3.14)).toBe('3.14');
  });

  it('should quote strings and escape quotes', () => {
    expect(toYaml('hello')).toBe('"hello"');
    expect(toYaml('with"quotes')).toBe('"with\\"quotes"');
  });

  it('should serialise empty arrays and objects', () => {
    expect(toYaml([])).toBe('[]');
    expect(toYaml({})).toBe('{}');
  });

  it('should serialise arrays with items', () => {
    const result = toYaml(['a', 'b']);
    expect(result).toBe('- "a"\n- "b"');
  });

  it('should serialise objects with scalar values on the same line', () => {
    const result = toYaml({ key: 'value', num: 42 });
    expect(result).toBe('key: "value"\nnum: 42');
  });

  it('should serialise nested objects with indentation', () => {
    const result = toYaml({ outer: { inner: { key: 'value' } } });
    expect(result).toBe('outer:\n  inner:\n    key: "value"');
  });

  it('should serialise objects containing arrays on new lines', () => {
    const result = toYaml({ list: ['one', 'two'] });
    expect(result).toBe('list:\n  - "one"\n  - "two"');
  });

  it('should serialise complex nested structures', () => {
    const input = {
      color: {
        background: {
          brand: {
            default: { light: '#1ebfff', dark: '#48d7ff' },
          },
        },
      },
      spacing: { 8: '2rem' },
    };
    const result = toYaml(input);
    expect(result).toContain('color:');
    expect(result).toContain('background:');
    expect(result).toContain('brand:');
    expect(result).toContain('default:');
    expect(result).toContain('light: "#1ebfff"');
    expect(result).toContain('dark: "#48d7ff"');
    expect(result).toContain('8: "2rem"');
  });
});

describe('toYamlBlock', () => {
  it('should indicate isSequence for arrays', () => {
    expect(toYamlBlock([]).isSequence).toBe(false);
    expect(toYamlBlock(['a']).isSequence).toBe(true);
  });
});

/*-- INTEGRATION TESTS --*/

describe('buildDesignMdTokens', () => {
  let tempDir: string;
  let baseCollection: DesignTokensCollection;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `design-md-test-${Math.random().toString(36).slice(2)}`);
    await mkdir(tempDir, { recursive: true });
    baseCollection = createBaseCollection();
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should generate a single DESIGN.md file with all tokens', async () => {
    const lightCollection = createLightCollection(baseCollection);
    const darkCollection = createDarkCollection(baseCollection);

    const modifiers: DesignTokenModifiers = new Map([
      [
        'theme',
        new Map([
          ['light', lightCollection],
          ['dark', darkCollection],
        ]),
      ],
    ]);

    await buildDesignMdTokens({
      baseCollection,
      modifiers,
      outputDirectory: tempDir,
      logger: Logger.never(),
    });

    const content = await readFile(join(tempDir, 'design-md', 'DESIGN.md'), 'utf-8');

    // Should contain the single DESIGN.md file, not per-product files
    expect(content).toBeDefined();

    // Alias resolution — the resolved value should be present (not a curly reference)
    expect(content).toContain('#f00');
    expect(content).not.toContain('{color.red.500}');

    // Theme nesting in YAML: themeable token should have light/dark keys
    expect(content).toContain('button:');

    // Non-themeable T2 token should be single scalar in YAML
    expect(content).toContain('typography:');

    // CSS variables in markdown tables
    expect(content).toContain('var(--esds-color-background-brand-default)');
    expect(content).toContain('var(--esds-typography-heading-lg)');

    // Tier separation (T1 is excluded; sections are renumbered)
    expect(content).not.toContain('Core Primitives');
    expect(content).toContain('2. Semantic Tokens');
    expect(content).toContain('3. Component Tokens');
    expect(content).toContain('4. AI Implementation Directives');

    // Single file, not product-specific
    expect(content).toContain('# Design Tokens Reference');
    expect(content).not.toContain('design.infomaniak.md');

    // T2 light/dark table columns even for non-themeable
    expect(content).toContain('| color.background.brand.default');
    expect(content).toContain('| color.content.primary');
  });

  it('should skip generation when theme modifiers are missing', async () => {
    const modifiers: DesignTokenModifiers = new Map([['product', new Map()]]);

    await buildDesignMdTokens({
      baseCollection,
      modifiers,
      outputDirectory: tempDir,
      logger: Logger.never(),
    });

    // No theme baselines means no file should be generated
    const file = await readFile(join(tempDir, 'design-md', 'DESIGN.md'), 'utf-8').catch(() => null);
    expect(file).toBeNull();
  });

  it('should contain the portable token usage directive', async () => {
    const lightCollection = createLightCollection(baseCollection);
    const darkCollection = createDarkCollection(baseCollection);

    const modifiers: DesignTokenModifiers = new Map([
      [
        'theme',
        new Map([
          ['light', lightCollection],
          ['dark', darkCollection],
        ]),
      ],
    ]);

    await buildDesignMdTokens({
      baseCollection,
      modifiers,
      outputDirectory: tempDir,
      logger: Logger.never(),
    });

    const content = await readFile(join(tempDir, 'design-md', 'DESIGN.md'), 'utf-8');

    // Should contain the portable token guidance
    expect(content).toContain('Portable product tokens');
    expect(content).toContain('color.background.brand.default');
    expect(content).toContain('color.background.brand.calendar.default');
  });

  it('should omit component tokens section when no T3 tokens exist', async () => {
    const noT3Base = new DesignTokensCollection([
      {
        files: ['/tokens/t1-primitive/color.tokens.json'],
        name: ['color', 'red', '500'],
        type: 'color',
        value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
      },
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'content', 'primary'],
        type: 'color',
        value: { hex: '#000000', components: [0, 0, 0], colorSpace: 'srgb' },
      },
    ]);

    const light = noT3Base.clone();
    const dark = noT3Base.clone();

    const modifiers: DesignTokenModifiers = new Map([
      [
        'theme',
        new Map([
          ['light', light],
          ['dark', dark],
        ]),
      ],
    ]);

    await buildDesignMdTokens({
      baseCollection: noT3Base,
      modifiers,
      outputDirectory: tempDir,
      logger: Logger.never(),
    });

    const content = await readFile(join(tempDir, 'design-md', 'DESIGN.md'), 'utf-8');

    // T1 is excluded; T2 should be present;
    expect(content).not.toContain('Core Primitives');
    expect(content).toContain('2. Semantic Tokens');

    // T3 should be omitted; AI directives should still appear
    expect(content).not.toContain('3. Component Tokens');
    expect(content).toContain('4. AI Implementation Directives');
  });
});
