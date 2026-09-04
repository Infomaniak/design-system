import type { LintNodeType } from './model/lint-node.ts';
import type { LintPropertyKind } from './model/lint-property.ts';

/**
 * Figma `VariableScope` values (plugin API). Only the ones relevant to v1 checks
 * are ever *required*, but the full union is kept for exhaustive typing of
 * variable scope arrays coming from the file.
 */
export type FigmaScope =
  | 'ALL_SCOPES'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR'
  | 'EFFECT_COLOR'
  | 'STROKE_FLOAT'
  | 'EFFECT_FLOAT'
  | 'GAP'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'OPACITY'
  | 'TEXT_CONTENT'
  | 'FONT_FAMILY'
  | 'FONT_STYLE'
  | 'FONT_WEIGHT'
  | 'FONT_SIZE'
  | 'LINE_HEIGHT'
  | 'LETTER_SPACING'
  | 'PARAGRAPH_SPACING'
  | 'PARAGRAPH_INDENT';

/**
 * Required Figma scope(s) for a checked property on a node type.
 *
 * Figma has no `PADDING` scope: auto-layout padding and gap both accept variables
 * scoped with `GAP` (matches the DS `spacing.tokens.json` which scopes spacing
 * tokens to `["GAP"]`).
 */
export function getRequiredScopes(
  kind: LintPropertyKind,
  nodeType: LintNodeType,
): readonly FigmaScope[] {
  switch (kind) {
    case 'fill':
      switch (nodeType) {
        case 'FRAME':
        // Instances are frame-like (components are frames); icon fills are
        // overridden on the inner vectors, not on the instance root.
        // falls through
        case 'INSTANCE':
          return ['FRAME_FILL'];
        case 'TEXT':
          return ['TEXT_FILL'];
        default:
          return ['SHAPE_FILL'];
      }
    case 'stroke':
      return ['STROKE_COLOR'];
    case 'padding':
    case 'gap':
      return ['GAP'];
    case 'cornerRadius':
      return ['CORNER_RADIUS'];
  }
}

/**
 * Human description of a required property target, used in rule messages.
 */
export function describeRequiredProperty(kind: LintPropertyKind, nodeType: LintNodeType): string {
  switch (kind) {
    case 'fill':
      switch (nodeType) {
        case 'FRAME':
        case 'INSTANCE':
          return 'frame fills';
        case 'TEXT':
          return 'text fills';
        default:
          return 'shape fills';
      }
    case 'stroke':
      return 'strokes';
    case 'padding':
      return 'padding';
    case 'gap':
      return 'gap';
    case 'cornerRadius':
      return 'corner radius';
  }
}

/**
 * Whether a variable's scopes allow using it on a property requiring `required`.
 *
 * - empty scopes = allowed everywhere (per spec)
 * - `ALL_SCOPES` covers everything
 * - `ALL_FILLS` covers any fill target
 */
export function scopesCoverProperty(
  scopes: readonly string[],
  required: readonly FigmaScope[],
): boolean {
  if (scopes.length === 0) {
    return true;
  }

  if (scopes.includes('ALL_SCOPES')) {
    return true;
  }

  const requiredSet: ReadonlySet<string> = new Set<string>(required);

  for (const scope of scopes) {
    if (requiredSet.has(scope)) {
      return true;
    }

    if (scope === 'ALL_FILLS' && required.some(isFillScope)) {
      return true;
    }
  }

  return false;
}

function isFillScope(scope: FigmaScope): boolean {
  return scope === 'FRAME_FILL' || scope === 'SHAPE_FILL' || scope === 'TEXT_FILL';
}
