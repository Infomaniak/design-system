import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { LintPartValue } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { TextStyleInfo } from '../model/text-style-info.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

type StyleOverrideableProp = 'fontSize' | 'fontWeight' | 'textDecoration' | 'lineHeight';

const OVERRIDABLE_PROPS: readonly {
  readonly key: StyleOverrideableProp;
  readonly label: string;
}[] = [
  { key: 'fontSize', label: 'font size' },
  { key: 'fontWeight', label: 'font weight' },
  { key: 'textDecoration', label: 'text decoration' },
  { key: 'lineHeight', label: 'line height' },
];

/**
 * Rule `style-override` (warning, deliberately never an error).
 *
 * The TEXT node applies a remote (published) text style but hand-sets
 * style-relevant props on top (size, weight, decoration, line height).
 * Designers legitimately override e.g. per-block line heights — this surfaces
 * the drift without blocking (decision 9: warning, and v2 ships no
 * suppression mechanism).
 *
 * Comparison rules:
 * - only props readable on BOTH the node and the style are compared — missing
 *   values are skipped, never guessed
 * - local styles are skipped (already flagged by `local-text-style`;
 *   comparing against a non-DS style is meaningless)
 *
 * Examples:
 * - remote style, matching props → pass
 * - remote style, size changed → warning naming `font size`
 * - remote style, line height changed → warning naming `line height`
 */
export const styleOverrideRule: LintRule = {
  id: 'style-override',
  title: 'Style override',
  severity: 'warning',
  appliesTo: ['textStyle'],
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'textStyle' || part.value.styleId === undefined) {
      return [];
    }

    const style = context.resolveTextStyle(part.value.styleId);

    if (style === undefined || !style.remote) {
      return [];
    }

    const overriddenLabels: readonly string[] = collectOverriddenProps(part.value, style);

    if (overriddenLabels.length === 0) {
      return [];
    }

    return [
      buildFinding(
        styleOverrideRule,
        observation,
        style.name,
        `Overrides the published style "${style.name}": ${overriddenLabels.join(', ')} differ.`,
      ),
    ];
  },
};

function collectOverriddenProps(
  value: Extract<LintPartValue, { kind: 'textStyle' }>,
  style: Pick<TextStyleInfo, StyleOverrideableProp>,
): readonly string[] {
  const overridden: string[] = [];

  for (const { key, label } of OVERRIDABLE_PROPS) {
    const nodeValue: number | string | undefined = value[key];
    const styleValue: number | string | undefined = style[key];

    if (nodeValue === undefined || styleValue === undefined) {
      continue;
    }

    if (nodeValue !== styleValue) {
      overridden.push(label);
    }
  }

  return overridden;
}
