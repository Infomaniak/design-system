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

export function stringPart(value: string): LintPropertyPart {
  return { id: 'part', value: { kind: 'string', value } };
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

export function stringProperty(
  kind: 'blendMode' | 'component' | 'textContent',
  ...parts: readonly LintPropertyPart[]
): LintProperty {
  return { kind, valueKind: 'string', parts };
}

export interface LintNodeFixtureOptions {
  readonly id?: string;
  readonly name?: string;
  /**
   * Post-mapping lint type by default, but raw Figma types are accepted too —
   * component rules test against observations whose part value carries the raw
   * type, and the fixture node's type is cosmetic there.
   */
  readonly type?: LintNodeType | (string & {});
  readonly visible?: boolean;
  readonly fromIconLibrary?: boolean;
  readonly properties?: readonly LintProperty[];
  readonly children?: readonly LintNode[];
}

export function lintNode(options: LintNodeFixtureOptions = {}): LintNode {
  return {
    id: options.id ?? 'node:1',
    name: options.name ?? 'Node',
    type: (options.type ?? 'FRAME') as LintNodeType,
    visible: options.visible ?? true,
    properties: options.properties ?? [],
    ...(options.fromIconLibrary === true ? { fromIconLibrary: true } : {}),
    children: options.children ?? [],
  };
}

export interface VariableInfoFixtureOptions {
  readonly id?: string;
  readonly name?: string;
  readonly collectionName?: string;
  readonly tier?: TokenTier;
  readonly scopes?: readonly string[];
  readonly remote?: boolean;
  /** Raw variable value (rgba color object, number…) for fix-suggestion tests. */
  readonly value?: unknown;
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
    remote: options.remote ?? true,
    ...(options.value === undefined ? {} : { value: options.value }),
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
