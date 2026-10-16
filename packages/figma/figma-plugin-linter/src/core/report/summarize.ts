import type { Finding } from '../model/finding.ts';
import type { LintSeverity } from '../model/lint-severity.ts';

export interface RuleSection {
  readonly ruleId: string;
  readonly title: string;
  readonly severity: LintSeverity;
  readonly findings: readonly Finding[];
}

export interface LintSummary {
  readonly sections: readonly RuleSection[];
  readonly errorCount: number;
  readonly warningCount: number;
}

const SEVERITY_ORDER: readonly LintSeverity[] = ['error', 'warning'];

/**
 * Groups findings by rule within severity — error sections first, warning
 * sections second; within a severity, rules keep first-appearance order.
 * Sections only exist for rules that have at least one finding.
 */
export function summarizeFindings(findings: readonly Finding[]): LintSummary {
  const sections: RuleSection[] = [];
  const sectionKeys: Set<string> = new Set();
  let errorCount: number = 0;
  let warningCount: number = 0;

  for (const severity of SEVERITY_ORDER) {
    const severityFindings: readonly Finding[] = findings.filter(
      (finding: Finding): boolean => finding.severity === severity,
    );

    if (severity === 'error') {
      errorCount = severityFindings.length;
    } else {
      warningCount = severityFindings.length;
    }

    for (const finding of severityFindings) {
      const key: string = `${severity}:${finding.ruleId}`;

      if (sectionKeys.has(key)) {
        continue;
      }

      sectionKeys.add(key);
      sections.push({
        ruleId: finding.ruleId,
        title: finding.ruleTitle,
        severity,
        findings: severityFindings.filter(
          (candidate: Finding): boolean => candidate.ruleId === finding.ruleId,
        ),
      });
    }
  }

  return { sections, errorCount, warningCount };
}
