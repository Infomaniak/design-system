import type { LintPartValue, LintPropertyKind } from './model/lint-property.ts';
import type { PropertyObservation } from './model/property-observation.ts';
import type { VariableInfo } from './model/variable-info.ts';

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

export function partValueToLabel(value: LintPartValue): string {
  switch (value.kind) {
    case 'color':
      return value.hex;
    case 'number':
      return `${value.value}px`;
    case 'string':
      return value.value;
    case 'effect':
      return effectValueToLabel(value);
    case 'textStyle':
      return textStyleValueToLabel(value);
  }
}

function textStyleValueToLabel(value: Extract<LintPartValue, { kind: 'textStyle' }>): string {
  const parts: string[] = [];

  if (value.fontWeight !== undefined) {
    parts.push(value.fontWeight);
  }

  if (value.fontSize !== undefined) {
    parts.push(`${value.fontSize}`);
  }

  return parts.length === 0 ? 'text style' : parts.join(' · ');
}

function effectValueToLabel(value: Extract<LintPartValue, { kind: 'effect' }>): string {
  const parts: string[] = [value.effectType];

  if (value.radius !== undefined) {
    parts.push(`${value.radius}px`);
  }

  if (value.offset !== undefined) {
    parts.push(`${value.offset.x}/${value.offset.y}`);
  }

  return parts.join(' ');
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
