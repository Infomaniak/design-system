import type { LintPartValue, LintPropertyKind } from './model/lint-property.ts';
import type { PropertyObservation } from './model/property-observation.ts';
import type { VariableInfo } from './model/variable-info.ts';

const PROPERTY_LABELS: Readonly<Record<LintPropertyKind, string>> = {
  fill: 'Fill',
  stroke: 'Stroke',
  padding: 'Padding',
  gap: 'Gap',
  cornerRadius: 'Corner radius',
};

/**
 * Display label for an observation's property, e.g. `Fill`, `Padding (top)`,
 * `Corner radius (bottom left)`. Parts without a label are property-level
 * (single paint, gap, uniform padding/corners).
 */
export function getObservationPropertyLabel(observation: PropertyObservation): string {
  const base: string = PROPERTY_LABELS[observation.property.kind];
  const partLabel: string | undefined = observation.part.label;

  return partLabel === undefined ? base : `${base} (${partLabel})`;
}

export function partValueToLabel(value: LintPartValue): string {
  return value.kind === 'color' ? value.hex : `${value.value}px`;
}

/**
 * Display label for a bound variable, e.g. `color/content/primary · t2`. The
 * collection suffix makes findings self-diagnosing (an unrecognized collection
 * is immediately visible). Unresolvable collections are omitted.
 */
export function variableToLabel(variable: VariableInfo): string {
  const name: string = variable.nameSegments.join('/');

  return variable.collectionName === '' ? name : `${name} · ${variable.collectionName}`;
}
