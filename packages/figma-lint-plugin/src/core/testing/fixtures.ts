import type { LintNode, LintNodeType } from '../model/lint-node.ts';
import type { LintProperty, LintPropertyPart } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { TokenTier } from '../model/token-tier.ts';
import type { VariableInfo } from '../model/variable-info.ts';

export function hexPart(hex: string, boundVariableId?: string): LintPropertyPart {
  return { id: 'part', value: { kind: 'color', hex }, boundVariableId };
}

export function numberPart(
  value: number,
  boundVariableId?: string,
  label?: string,
): LintPropertyPart {
  return { id: 'part', value: { kind: 'number', value }, boundVariableId, label };
}

export function colorProperty(
  kind: 'fill' | 'stroke',
  ...parts: readonly LintPropertyPart[]
): LintProperty {
  return { kind, valueKind: 'color', parts };
}

export function numberProperty(
  kind: 'padding' | 'gap' | 'cornerRadius',
  ...parts: readonly LintPropertyPart[]
): LintProperty {
  return { kind, valueKind: 'number', parts };
}

export interface LintNodeFixtureOptions {
  readonly id?: string;
  readonly name?: string;
  readonly type?: LintNodeType;
  readonly visible?: boolean;
  readonly properties?: readonly LintProperty[];
  readonly children?: readonly LintNode[];
}

export function lintNode(options: LintNodeFixtureOptions = {}): LintNode {
  return {
    id: options.id ?? 'node:1',
    name: options.name ?? 'Node',
    type: options.type ?? 'FRAME',
    visible: options.visible ?? true,
    properties: options.properties ?? [],
    children: options.children ?? [],
  };
}

export interface VariableInfoFixtureOptions {
  readonly id?: string;
  readonly name?: string;
  readonly collectionName?: string;
  readonly tier?: TokenTier;
  readonly scopes?: readonly string[];
  readonly aliasTargetId?: string;
}

export function variableInfo(options: VariableInfoFixtureOptions = {}): VariableInfo {
  const name: string = options.name ?? 'color/content/primary';

  return {
    id: options.id ?? name,
    nameSegments: name.split('/'),
    collectionName: options.collectionName ?? 't2',
    tier: options.tier ?? 't2',
    scopes: options.scopes ?? [],
    ...(options.aliasTargetId === undefined ? {} : { aliasTargetId: options.aliasTargetId }),
  };
}

export function observation(
  node: LintNode,
  property: LintProperty,
  part: LintPropertyPart,
): PropertyObservation {
  return { node, property, part };
}
