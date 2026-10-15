import type { LintContext } from './context.ts';
import { MAX_ALIAS_CHAIN_DEPTH } from './effective-variable.ts';
import { resolveFixFields } from './fix-fields.ts';
import { rgbaToHex, type RgbChannels } from './format-color.ts';
import type { FixSuggestion } from './model/finding.ts';
import type { LintPropertyKind, LintPropertyPart } from './model/lint-property.ts';
import type { PropertyObservation } from './model/property-observation.ts';
import type { VariableInfo } from './model/variable-info.ts';
import { getRequiredScopes, scopesCoverProperty } from './scopes.ts';
import { getColorTokenCategory, isAllowedColorUsage } from './semantic-usage.ts';

/** Tier rank for suggestion candidates: higher is more semantic. */
const TIER_RANK: ReadonlyMap<VariableInfo['tier'], number> = new Map([
  ['t3', 3],
  ['t2', 2],
  ['t1', 1],
]);

/**
 * Builds the ordered fix suggestions for an observation's part — every token
 * variable an exact value match could bind, recommended first (fix contract:
 * exact hex colors and exact float values only, decision 6, amended post-Stage-5:
 * ambiguity offers the ordered candidate list instead of suppressing).
 *
 * Rules of the engine:
 * - color parts match resolved variable color values by hex (alpha-agnostic);
 *   number parts match resolved variable numbers exactly
 * - raw float 0 is never suggested (it means "none", not a token value)
 * - hard filters (never offered): variables whose scopes don't cover the
 *   property (Figma would reject the binding), unknown-tier variables (local
 *   WIP collections — binding trades the finding for an unknown-collection
 *   warning), and for colors everything below t2 (binding a t1 fires
 *   primitive-misuse) plus semantic-category mismatches (a fix must never
 *   create a wrong-token error)
 * - ordering: more semantic tiers first (t3 > t2 > t1), then the canonical
 *   `@root` variants (the DS convention: `@root` aliases its base token);
 *   same-tier ties keep the pool order
 * - variable values resolve through alias chains up to the same depth cap the
 *   metadata loader uses
 */
export function buildFixSuggestions(
  observation: PropertyObservation,
  context: LintContext,
): readonly FixSuggestion[] {
  const { part, property, node } = observation;

  if (part.value.kind === 'color' && (property.kind === 'fill' || property.kind === 'stroke')) {
    return buildColorSuggestions(property.kind, part, node.type, context);
  }

  if (
    part.value.kind === 'number' &&
    (property.kind === 'padding' ||
      property.kind === 'gap' ||
      property.kind === 'cornerRadius' ||
      property.kind === 'strokeWeight')
  ) {
    return buildNumberSuggestions(property.kind, part, node.type, context);
  }

  return [];
}

function buildColorSuggestions(
  kind: Extract<LintPropertyKind, 'fill' | 'stroke'>,
  part: LintPropertyPart,
  nodeType: PropertyObservation['node']['type'],
  context: LintContext,
): readonly FixSuggestion[] {
  const partValue = part.value;

  if (partValue.kind !== 'color') {
    return [];
  }

  const paintIndex: number | undefined = parsePaintIndex(part.id);

  if (paintIndex === undefined) {
    return [];
  }

  const candidates: readonly VariableInfo[] = pickCandidates(
    context,
    kind,
    nodeType,
    (value: unknown): boolean => isColorValue(value) && rgbaToHex(value) === partValue.hex,
    { minTier: 't2', requireColorUsage: true },
  );

  return candidates.map((candidate: VariableInfo): FixSuggestion => ({
    label: toLeafLabel(candidate),
    kind: 'paint',
    target: candidate.id,
    fields: kind === 'fill' ? ['fills'] : ['strokes'],
    paintIndex,
  }));
}

function buildNumberSuggestions(
  kind: Extract<LintPropertyKind, 'padding' | 'gap' | 'cornerRadius' | 'strokeWeight'>,
  part: LintPropertyPart,
  nodeType: PropertyObservation['node']['type'],
  context: LintContext,
): readonly FixSuggestion[] {
  if (part.value.kind !== 'number' || part.value.value === 0) {
    return [];
  }

  const fields: readonly string[] | undefined = resolveFixFields(kind, part.id);

  if (fields === undefined) {
    return [];
  }

  const expected: number = part.value.value;
  const candidates: readonly VariableInfo[] = pickCandidates(
    context,
    kind,
    nodeType,
    (value: unknown): boolean => typeof value === 'number' && value === expected,
    { minTier: 't1', requireColorUsage: false },
  );

  return candidates.map((candidate: VariableInfo): FixSuggestion => ({
    label: toLeafLabel(candidate),
    kind: 'field',
    target: candidate.id,
    fields,
  }));
}

/** Color fixes require a semantic token (t2/t3); number fixes accept primitives. */
function tierRankFor(tier: VariableInfo['tier'], minTier: 't1' | 't2'): number | undefined {
  const rank: number | undefined = TIER_RANK.get(tier);

  if (rank === undefined) {
    return undefined;
  }

  return rank >= TIER_RANK.get(minTier)! ? rank : undefined;
}

/**
 * Finds every suggestion candidate for an exact value match, best first:
 * scope-covered variables whose resolved raw value satisfies `matches` form
 * alias groups (holder + aliases); hard filters drop out (see the engine
 * docblock); the survivors are ordered by tier (descending), then `@root`
 * variants first within a tier, then pool order.
 */
function pickCandidates(
  context: LintContext,
  kind: LintPropertyKind,
  nodeType: PropertyObservation['node']['type'],
  matches: (value: unknown) => boolean,
  policy: { readonly minTier: 't1' | 't2'; readonly requireColorUsage: boolean },
): readonly VariableInfo[] {
  const required: ReturnType<typeof getRequiredScopes> = getRequiredScopes(kind, nodeType);
  const groupById: Map<string, VariableInfo> = new Map();

  for (const variable of context.variablesById.values()) {
    if (!scopesCoverProperty(variable.scopes, required)) {
      continue;
    }

    const resolved: { readonly holder: VariableInfo; readonly value: unknown } | undefined =
      resolveRawValue(variable, context);

    if (resolved === undefined || !matches(resolved.value)) {
      continue;
    }

    groupById.set(variable.id, variable);
  }

  const candidates: { readonly variable: VariableInfo; readonly rank: number }[] = [];

  for (const member of groupById.values()) {
    const rank: number | undefined = tierRankFor(member.tier, policy.minTier);

    if (rank === undefined) {
      continue;
    }

    if (policy.requireColorUsage) {
      const category: ReturnType<typeof getColorTokenCategory> = getColorTokenCategory(
        member.nameSegments,
      );

      if (category !== 'unknown' && !isAllowedColorUsage(category, kind, nodeType)) {
        continue;
      }
    }

    candidates.push({ variable: member, rank });
  }

  return candidates
    .sort(
      (first, second): number =>
        second.rank - first.rank ||
        Number(isRootVariant(second.variable)) - Number(isRootVariant(first.variable)),
    )
    .map((entry): VariableInfo => entry.variable);
}

/** Whether a variable is a canonical `@root` variant (any segment). */
function isRootVariant(variable: VariableInfo): boolean {
  return variable.nameSegments.includes('@root');
}

/**
 * Follows alias chains (via the loader-extracted `aliasTargetId`) until a
 * variable carrying a raw value is reached — bounded by the same depth cap as
 * the metadata loader. Returns the value and the variable holding it (the
 * chain end).
 */
function resolveRawValue(
  variable: VariableInfo,
  context: LintContext,
): { readonly holder: VariableInfo; readonly value: unknown } | undefined {
  let current: VariableInfo = variable;

  for (let depth: number = 0; depth < MAX_ALIAS_CHAIN_DEPTH; depth += 1) {
    if (current.value !== undefined) {
      return { holder: current, value: current.value };
    }

    if (current.aliasTargetId === undefined) {
      return undefined;
    }

    const next: VariableInfo | undefined = context.resolveVariable(current.aliasTargetId);

    if (next === undefined) {
      return undefined;
    }

    current = next;
  }

  return undefined;
}

function isColorValue(value: unknown): value is RgbChannels {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RgbChannels).r === 'number' &&
    typeof (value as RgbChannels).g === 'number' &&
    typeof (value as RgbChannels).b === 'number'
  );
}

/** Paint part ids are `paint:<index>` (see the node adapter). */
function parsePaintIndex(partId: string): number | undefined {
  if (!partId.startsWith('paint:')) {
    return undefined;
  }

  const index: number = Number(partId.slice('paint:'.length));

  return Number.isInteger(index) && index >= 0 ? index : undefined;
}

/** Display label for a suggested token: its leaf name (`color/background/x` → `x`). */
function toLeafLabel(variable: VariableInfo): string {
  return variable.nameSegments.at(-1) ?? variable.id;
}
