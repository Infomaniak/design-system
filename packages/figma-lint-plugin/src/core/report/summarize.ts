import type { Finding } from '../model/finding.ts';
import type { LintSeverity } from '../model/lint-severity.ts';

export interface LintSummary {
  readonly errors: readonly Finding[];
  readonly warnings: readonly Finding[];
  readonly errorCount: number;
  readonly warningCount: number;
}

/**
 * Groups findings by severity — errors first, warnings second — and counts them.
 */
export function summarizeFindings(findings: readonly Finding[]): LintSummary {
  const bySeverity: ReadonlyMap<LintSeverity, readonly Finding[]> = Map.groupBy(
    findings,
    (finding: Finding): LintSeverity => finding.severity,
  );

  const errors: readonly Finding[] = bySeverity.get('error') ?? [];
  const warnings: readonly Finding[] = bySeverity.get('warning') ?? [];

  return {
    errors,
    warnings,
    errorCount: errors.length,
    warningCount: warnings.length,
  };
}
