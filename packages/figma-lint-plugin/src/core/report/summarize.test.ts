import { describe, expect, it } from 'vitest';
import type { Finding } from '../model/finding.ts';
import { summarizeFindings } from './summarize.ts';

function findingFixture(severity: Finding['severity'], id: string): Finding {
  return {
    ruleId: 'unbound-value',
    ruleTitle: 'Unbound value',
    severity,
    nodeId: `node:${id}`,
    nodeName: `Layer ${id}`,
    propertyLabel: 'Fill',
    valueLabel: '#4A90D9',
    message: 'Raw color value with no design token bound.',
  };
}

describe('summarizeFindings', () => {
  it('groups findings by severity with counts', () => {
    const summary = summarizeFindings([
      findingFixture('error', '1'),
      findingFixture('warning', '2'),
      findingFixture('error', '3'),
    ]);

    expect(summary.errorCount).toBe(2);
    expect(summary.warningCount).toBe(1);
    expect(summary.errors.map((finding: Finding): string => finding.nodeId)).toEqual([
      'node:1',
      'node:3',
    ]);
    expect(summary.warnings.map((finding: Finding): string => finding.nodeId)).toEqual(['node:2']);
  });

  it('returns empty groups for zero findings', () => {
    const summary = summarizeFindings([]);

    expect(summary.errors).toEqual([]);
    expect(summary.warnings).toEqual([]);
    expect(summary.errorCount).toBe(0);
    expect(summary.warningCount).toBe(0);
  });
});
