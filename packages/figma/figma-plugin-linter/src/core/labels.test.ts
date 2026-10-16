import { describe, expect, it } from 'vitest';
import { getObservationPropertyLabel } from './labels.ts';
import { hexPart, lintNode, numberPart, numberProperty, observation } from './testing/fixtures.ts';

describe('getObservationPropertyLabel', () => {
  it('labels property-level parts without a suffix', () => {
    const node = lintNode();
    const property = numberProperty('gap', numberPart(12));
    const label: string = getObservationPropertyLabel(
      observation(node, property, property.parts[0]!),
    );

    expect(label).toBe('Gap');
  });

  it('labels parts with a suffix', () => {
    const node = lintNode();
    const property = numberProperty('padding', numberPart(16, undefined, 'top'));
    const label: string = getObservationPropertyLabel(
      observation(node, property, property.parts[0]!),
    );

    expect(label).toBe('Padding (top)');
  });

  it('labels every property kind', () => {
    const node = lintNode();
    const fills = {
      kind: 'fill' as const,
      valueKind: 'color' as const,
      parts: [hexPart('#FFFFFF')],
    };
    const strokes = {
      kind: 'stroke' as const,
      valueKind: 'color' as const,
      parts: [hexPart('#000000')],
    };
    const radius = numberProperty('cornerRadius', numberPart(8));
    const strokeWeight = {
      kind: 'strokeWeight' as const,
      valueKind: 'number' as const,
      parts: [numberPart(1)],
    };
    const effect = {
      kind: 'effect' as const,
      valueKind: 'effect' as const,
      parts: [{ id: 'shadow', value: { kind: 'effect' as const, effectType: 'DROP_SHADOW' } }],
    };
    const opacity = {
      kind: 'opacity' as const,
      valueKind: 'number' as const,
      parts: [numberPart(0.5)],
    };
    const textStyle = {
      kind: 'textStyle' as const,
      valueKind: 'string' as const,
      parts: [{ id: 'style', value: { kind: 'string' as const, value: 'Heading/L' } }],
    };
    const textContent = {
      kind: 'textContent' as const,
      valueKind: 'string' as const,
      parts: [{ id: 'content', value: { kind: 'string' as const, value: 'Lorem ipsum' } }],
    };
    const component = {
      kind: 'component' as const,
      valueKind: 'string' as const,
      parts: [{ id: 'component', value: { kind: 'string' as const, value: 'icon/close' } }],
    };

    expect(getObservationPropertyLabel(observation(node, fills, fills.parts[0]!))).toBe('Fill');
    expect(getObservationPropertyLabel(observation(node, strokes, strokes.parts[0]!))).toBe(
      'Stroke',
    );
    expect(getObservationPropertyLabel(observation(node, radius, radius.parts[0]!))).toBe(
      'Corner radius',
    );
    expect(
      getObservationPropertyLabel(observation(node, strokeWeight, strokeWeight.parts[0]!)),
    ).toBe('Stroke weight');
    expect(getObservationPropertyLabel(observation(node, effect, effect.parts[0]!))).toBe('Effect');
    expect(getObservationPropertyLabel(observation(node, opacity, opacity.parts[0]!))).toBe(
      'Opacity',
    );
    expect(getObservationPropertyLabel(observation(node, textStyle, textStyle.parts[0]!))).toBe(
      'Text style',
    );
    expect(getObservationPropertyLabel(observation(node, textContent, textContent.parts[0]!))).toBe(
      'Text content',
    );
    expect(getObservationPropertyLabel(observation(node, component, component.parts[0]!))).toBe(
      'Component',
    );
  });
});
