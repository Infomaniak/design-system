import type { LintPropertyKind } from './model/lint-property.ts';
import type { PropertyObservation } from './model/property-observation.ts';

const PROPERTY_LABELS: Readonly<Record<LintPropertyKind, string>> = {
  fill: 'Fill',
  stroke: 'Stroke',
  padding: 'Padding',
  gap: 'Gap',
  cornerRadius: 'Corner radius',
  strokeWeight: 'Stroke weight',
  effect: 'Effect',
  opacity: 'Opacity',
  blendMode: 'Blend mode',
  textStyle: 'Text style',
  textContent: 'Text content',
  component: 'Component',
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
