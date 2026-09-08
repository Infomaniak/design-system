import type { Finding } from '../model/finding.ts';
import { summarizeFindings, type LintSummary } from './summarize.ts';

export interface MarkdownReportOptions {
  readonly inspectedCount?: number;
  readonly cancelled?: boolean;
}

function formatFinding(finding: Finding): string {
  return `**${finding.ruleTitle}** — \`${finding.nodeName}\` — ${finding.propertyLabel} — \`${finding.valueLabel}\``;
}

function formatCounts(summary: LintSummary): string {
  return `**${summary.errorCount} errors · ${summary.warningCount} warnings**`;
}

/**
 * Renders the "Copy report" markdown for a handoff ticket.
 */
export function findingsToMarkdown(
  findings: readonly Finding[],
  options: MarkdownReportOptions = {},
): string {
  const summary: LintSummary = summarizeFindings(findings);
  const lines: string[] = ['# Infomaniak Design Linter', '', formatCounts(summary)];

  if (options.inspectedCount !== undefined) {
    lines[2] = `${formatCounts(summary)} — ${options.inspectedCount} layers inspected`;
  }

  if (options.cancelled === true) {
    lines.push('', '_Cancelled — partial results._');
  }

  if (summary.errorCount > 0) {
    lines.push('', '## Errors');
    for (const finding of summary.errors) {
      lines.push(`- ${formatFinding(finding)}`);
    }
  }

  if (summary.warningCount > 0) {
    lines.push('', '## Warnings');
    for (const finding of summary.warnings) {
      lines.push(`- ${formatFinding(finding)}`);
    }
  }

  if (summary.errorCount === 0 && summary.warningCount === 0) {
    lines.push('', 'All checked properties are token-bound.');
  }

  return `${lines.join('\n')}\n`;
}
