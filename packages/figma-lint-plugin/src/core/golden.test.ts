import { describe, expect, it } from 'vitest';
import type { FigmaNode } from '../sandbox/figma-types.ts';
import { toLintNode } from '../sandbox/node-adapter.ts';
import { createLintContext } from './context.ts';
import { lintTree } from './engine/lint.ts';
import type { LintNode } from './model/lint-node.ts';
import type { VariableInfo } from './model/variable-info.ts';
import { LINT_RULES } from './rules/registry.ts';

/**
 * Golden acceptance tests: fixture documents reproducing every spec scenario
 * end-to-end (selection in → expected findings out).
 */

interface TokenFixture {
  readonly id: string;
  readonly name: string;
  readonly tier: 't1' | 't2' | 'unknown';
  readonly scopes: readonly string[];
  readonly collectionName?: string;
  readonly aliasTargetId?: string;
}

const T1_RADIUS: TokenFixture = {
  id: 'V:2',
  name: 'radius/8',
  tier: 't1',
  scopes: [],
};

const T1_FILL: TokenFixture = {
  id: 'V:1',
  name: 'color/gray/200',
  tier: 't1',
  scopes: [],
};

const KIT_FOREGROUND: TokenFixture = {
  id: 'V:kit-fg',
  name: 'foreground',
  tier: 'unknown',
  scopes: [],
  collectionName: 'theme',
};

const T2_RADIUS: TokenFixture = {
  id: 'V:radius-md',
  name: 'radius/md',
  tier: 't2',
  scopes: [],
};

const T2_BACKGROUND: TokenFixture = {
  id: 'V:3',
  name: 'color/background/elevation/surface/default',
  tier: 't2',
  scopes: ['FRAME_FILL', 'SHAPE_FILL'],
};

const T2_CONTENT: TokenFixture = {
  id: 'V:4',
  name: 'color/content/primary',
  tier: 't2',
  scopes: ['ALL_FILLS'],
};

const T2_BORDER: TokenFixture = {
  id: 'V:5',
  name: 'color/border/dim1/default',
  tier: 't2',
  scopes: ['STROKE_COLOR'],
};

const KIT_ALIAS_T2: TokenFixture = {
  id: 'V:kit-t2',
  name: 'primary-foreground',
  tier: 'unknown',
  scopes: [],
  collectionName: 'mode',
  aliasTargetId: T2_CONTENT.id,
};

const KIT_ALIAS_T1: TokenFixture = {
  id: 'V:kit-t1',
  name: 'secondary',
  tier: 'unknown',
  scopes: [],
  collectionName: 'mode',
  aliasTargetId: T1_FILL.id,
};

const TOKENS_BY_ID: ReadonlyMap<string, VariableInfo> = new Map(
  [
    T1_RADIUS,
    T1_FILL,
    KIT_FOREGROUND,
    KIT_ALIAS_T2,
    KIT_ALIAS_T1,
    T2_RADIUS,
    T2_BACKGROUND,
    T2_CONTENT,
    T2_BORDER,
  ].map((token: TokenFixture): readonly [string, VariableInfo] => [
    token.id,
    {
      id: token.id,
      nameSegments: token.name.split('/'),
      collectionName: token.collectionName ?? token.tier,
      tier: token.tier,
      scopes: token.scopes,
      ...(token.aliasTargetId === undefined ? {} : { aliasTargetId: token.aliasTargetId }),
    },
  ]),
);

const CONTEXT = createLintContext(TOKENS_BY_ID);

function fillPart(
  hex: string,
  tokenId?: string,
): {
  readonly id: string;
  readonly boundVariableId?: string;
  readonly value: { readonly kind: 'color'; readonly hex: string };
} {
  return { id: '0', boundVariableId: tokenId, value: { kind: 'color', hex } };
}

function fillProperty(part: ReturnType<typeof fillPart>): LintNode['properties'][number] {
  return { kind: 'fill', valueKind: 'color', parts: [part] };
}

function ruleIds(findings: readonly { readonly ruleId: string }[]): string[] {
  return findings.map((finding: { readonly ruleId: string }): string => finding.ruleId);
}

describe('golden acceptance — spec scenarios end-to-end', () => {
  it('scenario: frame with a planted raw fill → unbound-value error', async () => {
    const frame: LintNode = {
      id: 'n:1',
      name: 'Hero',
      type: 'FRAME',
      visible: true,
      properties: [fillProperty(fillPart('#4A90D9'))],
      children: [],
    };

    const result = await lintTree([frame], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['unbound-value']);
    expect(result.findings[0]).toMatchObject({
      severity: 'error',
      nodeName: 'Hero',
      propertyLabel: 'Fill',
      valueLabel: '#4A90D9',
    });
  });

  it('scenario: content token on a background fill → wrong-token error', async () => {
    const frame: LintNode = {
      id: 'n:1',
      name: 'Card',
      type: 'FRAME',
      visible: true,
      properties: [fillProperty(fillPart('#000000', T2_CONTENT.id))],
      children: [],
    };

    const result = await lintTree([frame], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['wrong-token']);
    expect(result.findings[0]!.severity).toBe('error');
  });

  it('scenario: background token on a text fill → wrong-scope + wrong-token errors', async () => {
    const text: LintNode = {
      id: 'n:2',
      name: 'Title',
      type: 'TEXT',
      visible: true,
      properties: [fillProperty(fillPart('#FFFFFF', T2_BACKGROUND.id))],
      children: [],
    };

    const result = await lintTree([text], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['wrong-scope', 'wrong-token']);
  });

  it('scenario: correctly token-bound background, text and stroke usage → clean', async () => {
    const frame: LintNode = {
      id: 'n:1',
      name: 'Card',
      type: 'FRAME',
      visible: true,
      properties: [fillProperty(fillPart('#FFFFFF', T2_BACKGROUND.id))],
      children: [
        {
          id: 'n:2',
          name: 'Label',
          type: 'TEXT',
          visible: true,
          properties: [fillProperty(fillPart('#000000', T2_CONTENT.id))],
          children: [],
        },
        {
          id: 'n:3',
          name: 'Separator',
          type: 'SHAPE',
          visible: true,
          properties: [
            {
              kind: 'stroke',
              valueKind: 'color',
              parts: [fillPart('#DDDDDD', T2_BORDER.id)],
            },
          ],
          children: [],
        },
      ],
    };

    const result = await lintTree([frame], { rules: LINT_RULES, context: CONTEXT });

    expect(result.findings).toEqual([]);
  });

  it('scenario: primitive radius → primitive-misuse warning', async () => {
    const shape: LintNode = {
      id: 'n:1',
      name: 'Thumb',
      type: 'SHAPE',
      visible: true,
      properties: [
        {
          kind: 'cornerRadius',
          valueKind: 'number',
          parts: [
            { id: 'uniform', boundVariableId: T1_RADIUS.id, value: { kind: 'number', value: 8 } },
          ],
        },
      ],
      children: [],
    };

    const result = await lintTree([shape], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['primitive-misuse']);
    expect(result.findings[0]!.severity).toBe('warning');
  });

  it('scenario: uniform radius bound in the editor (alias on the four corners) → clean', async () => {
    // Figma stores a corner-radius binding applied in the UI on the four
    // individual corner fields, never on `cornerRadius` (boundVariables docs).
    const alias = { type: 'VARIABLE_ALIAS' as const, id: T2_RADIUS.id };
    const frame: FigmaNode = {
      id: 'n:1',
      name: 'Card',
      type: 'FRAME',
      cornerRadius: 6,
      topLeftRadius: 6,
      topRightRadius: 6,
      bottomLeftRadius: 6,
      bottomRightRadius: 6,
      boundVariables: {
        topLeftRadius: alias,
        topRightRadius: alias,
        bottomLeftRadius: alias,
        bottomRightRadius: alias,
      },
    };

    const result = await lintTree([toLintNode(frame)], { rules: LINT_RULES, context: CONTEXT });

    expect(result.findings).toEqual([]);
  });

  it('scenario: instances are linted, hidden subtrees are pruned, locked layers are linted', async () => {
    const frame: LintNode = {
      id: 'n:1',
      name: 'Board',
      type: 'FRAME',
      visible: true,
      properties: [],
      children: [
        {
          id: 'n:2',
          name: 'Instance',
          type: 'INSTANCE',
          visible: true,
          properties: [fillProperty(fillPart('#FF0000'))],
          children: [],
        },
        {
          id: 'n:3',
          name: 'Hidden',
          type: 'SHAPE',
          visible: false,
          properties: [fillProperty(fillPart('#00FF00'))],
          children: [],
        },
        {
          id: 'n:4',
          name: 'Locked',
          type: 'SHAPE',
          visible: true,
          properties: [fillProperty(fillPart('#0000FF'))],
          children: [],
        },
      ],
    };

    const result = await lintTree([frame], { rules: LINT_RULES, context: CONTEXT });

    expect(result.inspectedCount).toBe(3);
    expect(
      result.findings.map((finding: { readonly nodeId: string }): string => finding.nodeId),
    ).toEqual(['n:2', 'n:4']);
  });

  it('scenario: t1 token bound on an instance fill → primitive-misuse warning', async () => {
    const instance: LintNode = {
      id: 'n:1',
      name: 'Buttons',
      type: 'INSTANCE',
      visible: true,
      properties: [fillProperty(fillPart('#FFC0C0', T1_FILL.id))],
      children: [],
    };

    const result = await lintTree([instance], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['primitive-misuse']);
    expect(result.findings[0]).toMatchObject({
      severity: 'warning',
      nodeName: 'Buttons',
      valueLabel: 'color/gray/200 · t1',
    });
  });

  it('scenario: token from an unrecognized collection → unknown-collection warning', async () => {
    const frame: LintNode = {
      id: 'n:1',
      name: 'Kit button',
      type: 'FRAME',
      visible: true,
      properties: [fillProperty(fillPart('#191F33', KIT_FOREGROUND.id))],
      children: [],
    };

    const result = await lintTree([frame], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['unknown-collection']);
    expect(result.findings[0]).toMatchObject({
      severity: 'warning',
      nodeName: 'Kit button',
      valueLabel: 'foreground · theme',
      message: 'Bound token comes from collection “theme” — expected t1/t2/t3.',
    });
  });

  it('scenario: kit token aliased to a t2 token → accepted, even where the target would be wrong-token', async () => {
    // Locks the "suppress only" decision: the alias chain suppresses
    // unknown-collection, but wrong-token is NOT validated through the chain —
    // a content token on a frame fill is only flagged when bound directly.
    const frame: LintNode = {
      id: 'n:1',
      name: 'Card',
      type: 'FRAME',
      visible: true,
      properties: [fillProperty(fillPart('#000000', KIT_ALIAS_T2.id))],
      children: [],
    };

    const result = await lintTree([frame], { rules: LINT_RULES, context: CONTEXT });

    expect(result.findings).toEqual([]);
  });

  it('scenario: kit token aliased to a t1 token → primitive-misuse warning', async () => {
    const instance: LintNode = {
      id: 'n:1',
      name: 'Buttons',
      type: 'INSTANCE',
      visible: true,
      properties: [fillProperty(fillPart('#FFC0C0', KIT_ALIAS_T1.id))],
      children: [],
    };

    const result = await lintTree([instance], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['primitive-misuse']);
    expect(result.findings[0]).toMatchObject({
      severity: 'warning',
      nodeName: 'Buttons',
      valueLabel: 'secondary · mode',
    });
  });

  it('scenario: uniform raw padding merged into one finding, distinct values per part', async () => {
    const uniform: LintNode = {
      id: 'n:1',
      name: 'Uniform',
      type: 'FRAME',
      visible: true,
      properties: [
        {
          kind: 'padding',
          valueKind: 'number',
          parts: [{ id: 'uniform', value: { kind: 'number', value: 16 } }],
        },
      ],
      children: [],
    };
    const mixed: LintNode = {
      id: 'n:2',
      name: 'Mixed',
      type: 'FRAME',
      visible: true,
      properties: [
        {
          kind: 'padding',
          valueKind: 'number',
          parts: [
            { id: 'top', label: 'top', value: { kind: 'number', value: 16 } },
            { id: 'bottom', label: 'bottom', value: { kind: 'number', value: 24 } },
          ],
        },
      ],
      children: [],
    };

    const result = await lintTree([uniform, mixed], { rules: LINT_RULES, context: CONTEXT });

    expect(result.findings).toHaveLength(3);
    expect(result.findings[0]!.propertyLabel).toBe('Padding');
    expect(result.findings[1]!.propertyLabel).toBe('Padding (top)');
    expect(result.findings[2]!.propertyLabel).toBe('Padding (bottom)');
  });

  it('scenario: bound variable missing from the file → unresolved-binding warning', async () => {
    const shape: LintNode = {
      id: 'n:1',
      name: 'Deleted-token',
      type: 'SHAPE',
      visible: true,
      properties: [fillProperty(fillPart('#AAAAAA', 'V:deleted'))],
      children: [],
    };

    const result = await lintTree([shape], { rules: LINT_RULES, context: CONTEXT });

    expect(ruleIds(result.findings)).toEqual(['unresolved-binding']);
    expect(result.findings[0]).toMatchObject({
      severity: 'warning',
      nodeName: 'Deleted-token',
      propertyLabel: 'Fill',
      valueLabel: '#AAAAAA',
    });
  });
});
