import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

const LOREM_PATTERN: RegExp = /\b(?:lorem|ipsum)\b/i;
const VALUE_LABEL_MAX_LENGTH: number = 40;

/**
 * Rule `lorem-ipsum` (warning).
 *
 * The text layer still carries placeholder copy. The pattern set is
 * word-bounded and case-insensitive: `lorem` or `ipsum` as standalone words
 * (accent-free as written in the placeholder itself). Real product copy never
 * contains these words, and partial matches ("Lorem-ipsum-body",
 * "LOREM IPSUM DOLOR") are caught too.
 */
export const loremIpsumRule: LintRule = {
  id: 'lorem-ipsum',
  title: 'Lorem ipsum',
  severity: 'warning',
  appliesTo: ['textContent'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'string' || !LOREM_PATTERN.test(part.value.value)) {
      return [];
    }

    return [
      buildFinding(
        loremIpsumRule,
        observation,
        truncateValueLabel(part.value.value),
        'Placeholder lorem ipsum copy — replace with real content.',
      ),
    ];
  },
};

function truncateValueLabel(value: string): string {
  const singleLine: string = value.replace(/\s+/g, ' ').trim();

  return singleLine.length <= VALUE_LABEL_MAX_LENGTH
    ? `"${singleLine}"`
    : `"${singleLine.slice(0, VALUE_LABEL_MAX_LENGTH).trimEnd()}…"`;
}
