import type { LintSeverity } from './lint-severity.ts';

export interface Finding {
  readonly ruleId: string;
  readonly ruleTitle: string;
  readonly severity: LintSeverity;
  readonly nodeId: string;
  readonly nodeName: string;
  readonly propertyLabel: string;
  readonly valueLabel: string;
  readonly message: string;
}
