import { describe, expect, it } from 'vitest';
import { createLintContext, type LintContext } from './context.ts';
import type { LintProperty, LintPropertyPart } from './model/lint-property.ts';
import type { VariableInfo } from './model/variable-info.ts';
import { buildFixSuggestions } from './suggested-fix.ts';
import {
  lintNode,
  numberPart,
  observation,
  stringPart,
  stringProperty,
} from './testing/fixtures.ts';

const RED: Rgba = { r: 1, g: 0, b: 0, a: 1 };

interface Rgba {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

function colorPart(hex: string): LintPropertyPart {
  return { id: 'paint:0', value: { kind: 'color', hex } };
}

function colorProperty(): LintProperty {
  return { kind: 'fill', valueKind: 'color', parts: [colorPart('#FF0000')] };
}

function variable(options: Partial<VariableInfo> & { id: string }): VariableInfo {
  return {
    id: options.id,
    nameSegments: options.nameSegments ?? [options.id],
    collectionName: options.collectionName ?? 't2',
    tier: options.tier ?? 't2',
    scopes: options.scopes ?? [],
    remote: options.remote ?? false,
    ...(options.value === undefined ? {} : { value: options.value }),
    ...(options.aliasTargetId === undefined ? {} : { aliasTargetId: options.aliasTargetId }),
  };
}

function contextWith(...variables: readonly VariableInfo[]): LintContext {
  return createLintContext(
    new Map(
      variables.map((info: VariableInfo): readonly [string, VariableInfo] => [info.id, info]),
    ),
  );
}

describe('buildFixSuggestions — color', () => {
  it('suggests the unique variable holding the exact hex', () => {
    const info = variable({
      id: 'V:1',
      nameSegments: ['color', 'background', 'surface-primary'],
      value: RED,
    });
    const context = contextWith(info);
    const node = lintNode({ id: 'node:1', name: 'Card', type: 'FRAME' });
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [
        {
          label: 'surface-primary',
          kind: 'paint',
          target: 'V:1',
          fields: ['fills'],
          paintIndex: 0,
        },
      ],
    );
  });

  it('keeps the paint index from the part id and targets strokes', () => {
    const info = variable({
      id: 'V:1',
      nameSegments: ['color', 'border', 'border-strong'],
      value: RED,
    });
    const context = contextWith(info);
    const node = lintNode({ id: 'node:1', type: 'FRAME' });
    const property: LintProperty = { kind: 'stroke', valueKind: 'color', parts: [] };

    expect(
      buildFixSuggestions(
        observation(node, property, { id: 'paint:2', value: { kind: 'color', hex: '#FF0000' } }),
        context,
      ),
    ).toEqual([
      {
        label: 'border-strong',
        kind: 'paint',
        target: 'V:1',
        fields: ['strokes'],
        paintIndex: 2,
      },
    ]);
  });

  it('resolves alias chains to the raw value', () => {
    const kit = variable({ id: 'V:kit', tier: 'unknown', aliasTargetId: 'V:1' });
    const token = variable({
      id: 'V:1',
      nameSegments: ['color', 'background', 'surface-primary'],
      value: RED,
    });
    const context = contextWith(kit, token);
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [
        {
          label: 'surface-primary',
          kind: 'paint',
          target: 'V:1',
          fields: ['fills'],
          paintIndex: 0,
        },
      ],
    );
  });

  it('proposes the published semantic token over the local primitive it aliases', () => {
    const localPrimitive = variable({
      id: 'V:blue',
      nameSegments: ['brand', 'blue-500'],
      collectionName: 'Local colors (WIP)',
      tier: 'unknown',
      value: RED,
    });
    const published = variable({
      id: 'V:root',
      nameSegments: ['color', 'background', 'brand', '@root'],
      remote: true,
      aliasTargetId: 'V:blue',
    });
    const context = contextWith(localPrimitive, published);
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [
        {
          label: '@root',
          kind: 'paint',
          target: 'V:root',
          fields: ['fills'],
          paintIndex: 0,
        },
      ],
    );
  });

  it('offers the whole same-value group, @root variant first', () => {
    const primitive = variable({
      id: 'V:blue600',
      nameSegments: ['blue-600'],
      collectionName: 't1',
      tier: 't1',
      value: RED,
    });
    const base = variable({
      id: 'V:base',
      nameSegments: ['color', 'background', 'brand', 'infomaniak'],
      aliasTargetId: 'V:blue600',
    });
    const root = variable({
      id: 'V:root',
      nameSegments: ['color', 'background', 'brand', '@root'],
      aliasTargetId: 'V:base',
    });
    const context = contextWith(primitive, base, root);
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [
        {
          label: '@root',
          kind: 'paint',
          target: 'V:root',
          fields: ['fills'],
          paintIndex: 0,
        },
        {
          label: 'infomaniak',
          kind: 'paint',
          target: 'V:base',
          fields: ['fills'],
          paintIndex: 0,
        },
      ],
    );
  });

  it('orders a same-tier tie by pool order with every candidate offered', () => {
    const context = contextWith(
      variable({ id: 'V:1', nameSegments: ['color', 'background', 'one'], value: RED }),
      variable({ id: 'V:2', nameSegments: ['color', 'background', 'two'], value: { ...RED } }),
    );
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [
        { label: 'one', kind: 'paint', target: 'V:1', fields: ['fills'], paintIndex: 0 },
        { label: 'two', kind: 'paint', target: 'V:2', fields: ['fills'], paintIndex: 0 },
      ],
    );
  });

  it('prefers t3 over t2 within an alias group', () => {
    const primitive = variable({
      id: 'V:blue',
      nameSegments: ['blue-500'],
      collectionName: 't1',
      tier: 't1',
      value: RED,
    });
    const t2 = variable({
      id: 'V:t2',
      nameSegments: ['color', 'background', 'brand', '@root'],
      aliasTargetId: 'V:blue',
    });
    const t3 = variable({
      id: 'V:t3',
      nameSegments: ['button', 'primary'],
      collectionName: 't3',
      tier: 't3',
      aliasTargetId: 'V:blue',
    });
    const context = contextWith(primitive, t2, t3);
    const node = lintNode();
    const property = colorProperty();

    const suggestions = buildFixSuggestions(
      observation(node, property, colorPart('#FF0000')),
      context,
    );

    expect(suggestions.map((suggestion): string => suggestion.target)).toEqual(['V:t3', 'V:t2']);
  });

  it('gives no suggestion when only a t1 primitive holds the color', () => {
    const primitive = variable({
      id: 'V:blue',
      nameSegments: ['blue-500'],
      collectionName: 't1',
      tier: 't1',
      value: RED,
    });
    const context = contextWith(primitive);
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [],
    );
  });

  it('gives no suggestion when the only match is an unknown-tier (local WIP) token', () => {
    const wip = variable({
      id: 'V:wip',
      nameSegments: ['blue-500'],
      collectionName: 'Local colors (WIP)',
      tier: 'unknown',
      value: RED,
    });
    const context = contextWith(wip);
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [],
    );
  });

  it('gives no suggestion when the token category mismatches the property', () => {
    const content = variable({
      id: 'V:content',
      nameSegments: ['color', 'content', 'primary'],
      value: RED,
    });
    const context = contextWith(content);
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [],
    );
  });

  it('gives no suggestion without any match', () => {
    const context = contextWith(
      variable({
        id: 'V:1',
        nameSegments: ['color', 'background', 'green'],
        value: { r: 0, g: 1, b: 0, a: 1 },
      }),
    );
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [],
    );
  });

  it('gives no suggestion when the variable scope does not cover the property', () => {
    const context = contextWith(
      variable({
        id: 'V:1',
        nameSegments: ['color', 'background', 'one'],
        value: RED,
        scopes: ['TEXT_FILL'],
      }),
    );
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [],
    );
  });

  it('suggests for a scope-covered variable (ALL_SCOPES)', () => {
    const context = contextWith(
      variable({
        id: 'V:1',
        nameSegments: ['color', 'background', 'one'],
        value: RED,
        scopes: ['ALL_SCOPES'],
      }),
    );
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty();

    expect(
      buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context),
    ).toHaveLength(1);
  });
});

describe('buildFixSuggestions — numbers', () => {
  it('suggests the unique variable holding the exact float', () => {
    const info = variable({ id: 'V:space', nameSegments: ['spacing', '8'], value: 8 });
    const context = contextWith(info);
    const node = lintNode();
    const property: LintProperty = { kind: 'gap', valueKind: 'number', parts: [] };

    expect(buildFixSuggestions(observation(node, property, numberPart(8)), context)).toEqual([
      {
        label: '8',
        kind: 'field',
        target: 'V:space',
        fields: ['itemSpacing'],
      },
    ]);
  });

  it('offers same-value tokens of different tiers, most semantic first', () => {
    const t1 = variable({
      id: 'V:t1',
      nameSegments: ['8'],
      collectionName: 't1',
      tier: 't1',
      value: 8,
    });
    const t2 = variable({ id: 'V:t2', nameSegments: ['spacing', '8'], value: 8 });
    const context = contextWith(t1, t2);
    const node = lintNode();
    const property: LintProperty = { kind: 'gap', valueKind: 'number', parts: [] };

    expect(
      buildFixSuggestions(observation(node, property, numberPart(8)), context).map(
        (suggestion): string => suggestion.target,
      ),
    ).toEqual(['V:t2', 'V:t1']);
  });

  it('expands uniform padding to all four fields', () => {
    const context = contextWith(variable({ id: 'V:space', value: 16 }));
    const node = lintNode();
    const property: LintProperty = { kind: 'padding', valueKind: 'number', parts: [] };
    const part: LintPropertyPart = { id: 'uniform', value: { kind: 'number', value: 16 } };

    expect(buildFixSuggestions(observation(node, property, part), context)).toMatchObject([
      { fields: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] },
    ]);
  });

  it('maps per-side padding parts to their own field', () => {
    const context = contextWith(variable({ id: 'V:space', value: 16 }));
    const node = lintNode();
    const property: LintProperty = { kind: 'padding', valueKind: 'number', parts: [] };
    const part: LintPropertyPart = { id: 'paddingLeft', value: { kind: 'number', value: 16 } };

    expect(buildFixSuggestions(observation(node, property, part), context)).toMatchObject([
      { fields: ['paddingLeft'] },
    ]);
  });

  it('never suggests for raw 0', () => {
    const context = contextWith(variable({ id: 'V:space', value: 0 }));
    const node = lintNode();
    const property: LintProperty = { kind: 'padding', valueKind: 'number', parts: [] };

    expect(buildFixSuggestions(observation(node, property, numberPart(0)), context)).toEqual([]);
  });

  it('requires an exact float match', () => {
    const context = contextWith(variable({ id: 'V:space', value: 8 }));
    const node = lintNode();
    const property: LintProperty = { kind: 'strokeWeight', valueKind: 'number', parts: [] };

    expect(buildFixSuggestions(observation(node, property, numberPart(8.5)), context)).toEqual([]);
  });
});

describe('buildFixSuggestions — guards', () => {
  it('never suggests for string, effect or text-style parts', () => {
    const context = contextWith(variable({ id: 'V:1', value: 'anything' }));
    const node = lintNode();
    const blendMode = stringProperty('blendMode', stringPart('MULTIPLY'));
    const component = stringProperty('component', stringPart('FRAME'));

    expect(buildFixSuggestions(observation(node, blendMode, blendMode.parts[0]!), context)).toEqual(
      [],
    );
    expect(buildFixSuggestions(observation(node, component, component.parts[0]!), context)).toEqual(
      [],
    );
  });

  it('gives no suggestion for color parts outside paint:<index> ids', () => {
    const context = contextWith(
      variable({ id: 'V:1', nameSegments: ['color', 'background', 'one'], value: RED }),
    );
    const node = lintNode();
    const property = colorProperty();

    expect(
      buildFixSuggestions(
        observation(node, property, { id: 'uniform', value: { kind: 'color', hex: '#FF0000' } }),
        context,
      ),
    ).toEqual([]);
  });

  it('terminates on alias cycles without hanging or suggesting', () => {
    const a = variable({ id: 'V:a', tier: 'unknown', aliasTargetId: 'V:b' });
    const b = variable({ id: 'V:b', tier: 'unknown', aliasTargetId: 'V:a' });
    const context = contextWith(a, b);
    const node = lintNode();
    const property = colorProperty();

    expect(buildFixSuggestions(observation(node, property, colorPart('#FF0000')), context)).toEqual(
      [],
    );
  });
});
