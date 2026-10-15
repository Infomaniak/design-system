import type { LintPropertyKind } from './model/lint-property.ts';

/** Auto-layout padding fields — bound together for a uniform value. */
const PADDING_FIELDS: readonly string[] = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
];

/** Corner radius fields — bound together for a uniform value. */
const CORNER_FIELDS: readonly string[] = [
  'topLeftRadius',
  'topRightRadius',
  'bottomLeftRadius',
  'bottomRightRadius',
];

const KNOWN_FLOAT_FIELDS: ReadonlySet<string> = new Set([
  ...PADDING_FIELDS,
  ...CORNER_FIELDS,
  'itemSpacing',
  'strokeWeight',
]);

/**
 * Figma fields a fix must bind for a property kind + part id.
 *
 * Part ids double as Figma field names for per-side parts (`paddingTop`,
 * `topLeftRadius`…); uniform parts carry the id `uniform` and expand to all
 * their sides. Returns undefined for paint properties (fills/strokes are bound
 * through paint reassignment, not `setBoundVariable`) and for unknown part ids
 * — the suggestion engine treats undefined as "not fixable".
 */
export function resolveFixFields(
  kind: LintPropertyKind,
  partId: string,
): readonly string[] | undefined {
  switch (kind) {
    case 'fill':
    case 'stroke':
      return undefined;
    case 'padding':
      return partId === 'uniform' ? PADDING_FIELDS : withKnownField(partId);
    case 'gap':
      return ['itemSpacing'];
    case 'cornerRadius':
      return partId === 'uniform' ? CORNER_FIELDS : withKnownField(partId);
    case 'strokeWeight':
      return ['strokeWeight'];
    default:
      return undefined;
  }
}

function withKnownField(partId: string): readonly string[] | undefined {
  return KNOWN_FLOAT_FIELDS.has(partId) ? [partId] : undefined;
}
