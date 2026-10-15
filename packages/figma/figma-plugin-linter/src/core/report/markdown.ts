import type { Finding } from '../model/finding.ts';
import type { LintSeverity } from '../model/lint-severity.ts';
import { summarizeFindings, type LintSummary } from './summarize.ts';

export interface MarkdownReportOptions {
  readonly inspectedCount?: number;
  readonly cancelled?: boolean;
}

const SEVERITY_HEADINGS: Readonly<Record<LintSeverity, string>> = {
  error: 'Errors',
  warning: 'Warnings',
};

function formatFinding(finding: Finding): string {
  return `\`${finding.nodeName}\` — ${finding.propertyLabel} — \`${finding.valueLabel}\``;
}

function formatCounts(summary: LintSummary): string {
  return `**${summary.errorCount} errors · ${summary.warningCount} warnings**`;
}

/**
 * Renders the "Copy report" markdown for a handoff ticket: findings grouped by
 * rule within severity, mirroring the panel's rule sections.
 */
export function findingsToMarkdown(
  findings: readonly Finding[],
  options: MarkdownReportOptions = {},
): string {
  const summary: LintSummary = summarizeFindings(findings);
  const lines: string[] = ['# ESDS Linter', '', formatCounts(summary)];

  if (options.inspectedCount !== undefined) {
    lines[2] = `${formatCounts(summary)} — ${options.inspectedCount} layers inspected`;
  }

  if (options.cancelled === true) {
    lines.push('', '_Cancelled — partial results._');
  }

  let currentSeverity: LintSeverity | undefined;

  for (const section of summary.sections) {
    if (section.severity !== currentSeverity) {
      currentSeverity = section.severity;
      lines.push('', `## ${SEVERITY_HEADINGS[currentSeverity]}`);
    }

    lines.push('', `### ${section.title} (${section.findings.length})`);

    for (const finding of section.findings) {
      lines.push(`- ${formatFinding(finding)}`);
    }
  }

  if (summary.sections.length === 0) {
    lines.push('', 'All checked properties are token-bound.');
  }

  return `${lines.join('\n')}\n`;
}
