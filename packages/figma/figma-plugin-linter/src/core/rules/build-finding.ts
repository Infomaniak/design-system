import { getObservationPropertyLabel } from '../labels.ts';
import type { Finding, FixSuggestion } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { LintRule } from './rule.ts';

/**
 * Builds a finding from a rule and the observation that triggered it, filling in
 * the shared fields (node, property label, rule identity) plus optional ordered
 * fix suggestions (fix mode, Stage 5).
 */
export function buildFinding(
  rule: LintRule,
  observation: PropertyObservation,
  valueLabel: string,
  message: string,
  suggestedFixes?: readonly FixSuggestion[],
): Finding {
  return {
    ruleId: rule.id,
    ruleTitle: rule.title,
    severity: rule.severity,
    nodeId: observation.node.id,
    nodeName: observation.node.name,
    propertyLabel: getObservationPropertyLabel(observation),
    valueLabel,
    message,
    ...(suggestedFixes === undefined || suggestedFixes.length === 0 ? {} : { suggestedFixes }),
  };
}
