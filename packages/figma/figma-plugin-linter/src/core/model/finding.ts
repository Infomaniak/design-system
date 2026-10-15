import type { LintSeverity } from './lint-severity.ts';

/**
 * Fix suggestions the plugin can apply, ordered best-first: bind a token
 * variable to the offending property. `kind: 'paint'` binds a paint color
 * (`paintIndex` targets the exact paint in the fills/strokes array);
 * `kind: 'field'` binds named float fields (`fields` — one or several, e.g.
 * all four padding sides). When several tokens share the value the list
 * carries every choice; the user picks in the panel.
 */
export interface FixSuggestion {
  readonly label: string;
  readonly kind: 'paint' | 'field';
  readonly target: string;
  readonly fields?: readonly string[];
  readonly paintIndex?: number;
}

export interface Finding {
  readonly ruleId: string;
  readonly ruleTitle: string;
  readonly severity: LintSeverity;
  readonly nodeId: string;
  readonly nodeName: string;
  readonly propertyLabel: string;
  readonly valueLabel: string;
  readonly message: string;
  readonly suggestedFixes?: readonly FixSuggestion[];
}
