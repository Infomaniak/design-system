import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { LintPropertyKind } from '../model/lint-property.ts';
import type { LintSeverity } from '../model/lint-severity.ts';
import type { PropertyObservation } from '../model/property-observation.ts';

/**
 * A lint rule is a pure function over `PropertyObservation`s: it never traverses
 * the tree and never touches the Figma API.
 *
 * Adding a rule = new file in `core/rules/` + one line in `registry.ts`.
 */
export interface LintRule {
  readonly id: string;
  readonly title: string;
  readonly severity: LintSeverity;
  readonly appliesTo: readonly LintPropertyKind[];
  readonly evaluate: (observation: PropertyObservation, context: LintContext) => readonly Finding[];
}
