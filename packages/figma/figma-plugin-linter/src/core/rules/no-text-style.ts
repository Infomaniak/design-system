import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { LintPartValue } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `no-text-style` (error).
 *
 * A TEXT node carries no text style: the typography was set by hand and will
 * drift from the token set. Non-TEXT nodes never observe a `textStyle`
 * property (the adapter gates the extraction), and unstyled text carries no
 * `styleId` in its payload.
 *
 * Examples:
 * - TEXT with raw font (no `textStyleId`) → error
 * - TEXT with a `textStyleId` → pass (checked by `local-text-style` and
 *   `style-override` instead)
 */
export const noTextStyleRule: LintRule = {
  id: 'no-text-style',
  title: 'No text style',
  severity: 'error',
  appliesTo: ['textStyle'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'textStyle' || part.value.styleId !== undefined) {
      return [];
    }

    return [
      buildFinding(
        noTextStyleRule,
        observation,
        rawFontToLabel(part.value),
        'Text styled by hand — apply a published text style.',
      ),
    ];
  },
};

function rawFontToLabel(value: Extract<LintPartValue, { kind: 'textStyle' }>): string {
  const props: string[] = [];

  if (value.fontWeight !== undefined) {
    props.push(value.fontWeight);
  }

  if (value.fontSize !== undefined) {
    props.push(`${value.fontSize}px`);
  }

  return props.length === 0 ? 'raw font' : props.join(' · ');
}
