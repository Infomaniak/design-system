import { describe, expect, it } from 'vitest';
import type { Finding } from '../model/finding.ts';
import { summarizeFindings } from './summarize.ts';

function findingFixture(
  severity: Finding['severity'],
  id: string,
  ruleId: string = 'unbound-value',
  ruleTitle: string = 'Unbound value',
): Finding {
  return {
    ruleId,
    ruleTitle,
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

    const flatFindings: readonly Finding[] = summary.sections.flatMap(
      (section): readonly Finding[] => section.findings,
    );
    expect(flatFindings.map((finding: Finding): string => finding.nodeId)).toEqual([
      'node:1',
      'node:3',
      'node:2',
    ]);
  });

  it('groups by rule within severity, errors first, rules in first-appearance order', () => {
    const summary = summarizeFindings([
      findingFixture('error', '1', 'unbound-value', 'Unbound value'),
      findingFixture('warning', '2', 'primitive-misuse', 'Primitive misuse'),
      findingFixture('error', '3', 'unbound-value', 'Unbound value'),
      findingFixture('error', '4', 'wrong-token', 'Wrong token'),
      findingFixture('warning', '5', 'unbound-value', 'Unbound value'),
    ]);

    const sectionKeys: readonly string[] = summary.sections.map(
      (section): string => `${section.severity}:${section.ruleId}`,
    );
    expect(sectionKeys).toEqual([
      'error:unbound-value',
      'error:wrong-token',
      'warning:primitive-misuse',
      'warning:unbound-value',
    ]);
    const sectionSizes: readonly number[] = summary.sections.map(
      (section): number => section.findings.length,
    );
    expect(sectionSizes).toEqual([2, 1, 1, 1]);
    expect(summary.sections[0]!.title).toBe('Unbound value');
    expect(summary.sections[1]!.title).toBe('Wrong token');
    expect(summary.errorCount).toBe(3);
    expect(summary.warningCount).toBe(2);
  });

  it('renders one section per rule with the findings in input order', () => {
    const summary = summarizeFindings([
      findingFixture('error', '1', 'wrong-token', 'Wrong token'),
      findingFixture('error', '2', 'unbound-value', 'Unbound value'),
      findingFixture('error', '3', 'wrong-token', 'Wrong token'),
    ]);

    expect(summary.sections).toHaveLength(2);
    expect(summary.sections[0]!.findings.map((finding: Finding): string => finding.nodeId)).toEqual(
      ['node:1', 'node:3'],
    );
    expect(summary.sections[1]!.findings.map((finding: Finding): string => finding.nodeId)).toEqual(
      ['node:2'],
    );
  });

  it('returns empty sections and counts for zero findings', () => {
    const summary = summarizeFindings([]);

    expect(summary.sections).toEqual([]);
    expect(summary.errorCount).toBe(0);
    expect(summary.warningCount).toBe(0);
  });
});
