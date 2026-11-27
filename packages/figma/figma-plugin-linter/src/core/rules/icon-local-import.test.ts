import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { lintNode, observation, stringPart, stringProperty } from '../testing/fixtures.ts';
import { iconLocalImportRule } from './icon-local-import.ts';

function componentProperty(rawType: string): ReturnType<typeof stringProperty> {
  return stringProperty('component', stringPart(rawType));
}

const context = createLintContext(new Map());

function evaluate(
  rawType: string,
  name: string,
  fromIconLibrary?: boolean,
  shape?: {
    readonly width?: number;
    readonly height?: number;
    readonly isAsset?: boolean;
    readonly hasImageFill?: boolean;
  },
): number {
  const node = lintNode({
    id: 'node:1',
    name,
    type: rawType,
    ...(fromIconLibrary === undefined ? {} : { fromIconLibrary }),
    ...(shape?.width === undefined ? {} : { width: shape.width }),
    ...(shape?.height === undefined ? {} : { height: shape.height }),
    ...(shape?.isAsset === undefined ? {} : { isAsset: shape.isAsset }),
    ...(shape?.hasImageFill === undefined ? {} : { hasImageFill: shape.hasImageFill }),
  });
  const property = componentProperty(rawType);

  return iconLocalImportRule.evaluate(observation(node, property, property.parts[0]!), context)
    .length;
}

describe('icon-local-import rule', () => {
  it('flags a vector named exactly like a kit icon (local SVG import)', () => {
    const node = lintNode({ id: 'node:1', name: 'chevron-right', type: 'VECTOR' });
    const property = componentProperty('VECTOR');

    const findings = iconLocalImportRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'icon-local-import',
        ruleTitle: 'Icon local import',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'chevron-right',
        propertyLabel: 'Component',
        valueLabel: 'chevron-right',
        message:
          'Named like a kit icon but not instanced from the Edelweiss Iconography library — instance the published component instead.',
      },
    ]);
  });

  it('flags every icon-carrier shape type and prefixed names', () => {
    for (const rawType of [
      'VECTOR',
      'ELLIPSE',
      'RECTANGLE',
      'POLYGON',
      'STAR',
      'LINE',
      'BOOLEAN_OPERATION',
    ] as const) {
      expect(evaluate(rawType, 'plus')).toBe(1);
      expect(evaluate(rawType, 'esds/icon/plus')).toBe(1);
    }
  });

  it('flags instances that do not come from the published kit', () => {
    // No resolved identity marked the instance `fromIconLibrary`: local
    // component duplicate, unresolvable main component — both unverified.
    expect(evaluate('INSTANCE', 'esds/icon/plus')).toBe(1);
  });

  it('passes nodes inside a verified kit instance', () => {
    expect(evaluate('INSTANCE', 'esds/icon/plus', true)).toBe(0);
    expect(evaluate('VECTOR', 'glyph', true)).toBe(0);
  });

  it('passes types policed by the other icon rules', () => {
    // Drawn containers → icon-as-frame (error); local components →
    // local-duplicate (warning); text layers carry their own rules.
    expect(evaluate('FRAME', 'plus')).toBe(0);
    expect(evaluate('SECTION', 'plus')).toBe(0);
    expect(evaluate('GROUP', 'plus')).toBe(0);
    expect(evaluate('COMPONENT', 'esds/icon/plus')).toBe(0);
    expect(evaluate('COMPONENT_SET', 'esds/icon/plus')).toBe(0);
    expect(evaluate('TEXT', 'plus')).toBe(0);
  });

  it('passes renamed or partial icon names', () => {
    for (const name of ['plus copy', 'icon plus', 'chevron', 'esds/icon/plus-bold']) {
      expect(evaluate('VECTOR', name)).toBe(0);
    }
  });

  it('matches kit set names carrying trailing spaces', () => {
    expect(evaluate('VECTOR', 'esds/icon/minus ')).toBe(1);
  });

  it('never flags a genuine kit instance named with a trailing space', () => {
    expect(evaluate('INSTANCE', 'esds/icon/minus ', true)).toBe(0);
  });

  it('flags a generically named vector that Figma marks as an asset', () => {
    // The "Vector path" case: a local SVG import nobody renamed.
    expect(evaluate('VECTOR', 'Vector path', undefined, { isAsset: true })).toBe(1);
  });

  it('flags generically named icon-sized vectors and local icon instances', () => {
    // The "Icon — From this file" case: an unnamed icon-shaped instance of a
    // local component, plus a canonical-size vector Figma's heuristic missed.
    expect(evaluate('INSTANCE', 'Icon', undefined, { width: 24, height: 24 })).toBe(1);
    expect(evaluate('VECTOR', 'Vector 3', undefined, { width: 40, height: 40 })).toBe(1);
  });

  it('accepts a small float drift around canonical sizes', () => {
    expect(evaluate('INSTANCE', 'Icon', undefined, { width: 23.99999, height: 24.00001 })).toBe(1);
  });

  it('stays silent on non-icon-sized and non-asset nodes without an icon name', () => {
    expect(evaluate('VECTOR', 'Divider', undefined, { width: 100, height: 2 })).toBe(0);
    expect(evaluate('VECTOR', 'Blob', undefined, { width: 56, height: 56 })).toBe(0);
    expect(evaluate('INSTANCE', 'Badge', undefined, { width: 64, height: 24 })).toBe(0);
    expect(evaluate('VECTOR', 'Mystery', undefined)).toBe(0);
  });

  it('stays silent on image assets and the components holding them', () => {
    // `isAsset` fires for raster images too — a placed photo or an avatar
    // component instance is not an icon.
    expect(
      evaluate('RECTANGLE', 'image.png', undefined, { isAsset: true, hasImageFill: true }),
    ).toBe(0);
    expect(
      evaluate('INSTANCE', 'Avatar', undefined, { width: 24, height: 24, hasImageFill: true }),
    ).toBe(0);
  });
});
