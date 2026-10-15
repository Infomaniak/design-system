import { describe, expect, it } from 'vitest';
import { getObservationPropertyLabel, partValueToLabel, variableToLabel } from './labels.ts';
import {
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  observation,
  variableInfo,
} from './testing/fixtures.ts';

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

describe('partValueToLabel', () => {
  it('formats colors as hex', () => {
    expect(partValueToLabel({ kind: 'color', hex: '#4A90D9' })).toBe('#4A90D9');
  });

  it('formats numbers with px', () => {
    expect(partValueToLabel({ kind: 'number', value: 16 })).toBe('16px');
  });

  it('formats strings as-is', () => {
    expect(partValueToLabel({ kind: 'string', value: 'Heading/L' })).toBe('Heading/L');
  });

  it('formats effects with type, radius and offset', () => {
    expect(partValueToLabel({ kind: 'effect', effectType: 'DROP_SHADOW' })).toBe('DROP_SHADOW');
    expect(partValueToLabel({ kind: 'effect', effectType: 'DROP_SHADOW', radius: 4 })).toBe(
      'DROP_SHADOW 4px',
    );
    expect(
      partValueToLabel({
        kind: 'effect',
        effectType: 'DROP_SHADOW',
        radius: 4,
        offset: { x: 0, y: 2 },
      }),
    ).toBe('DROP_SHADOW 4px 0/2');
  });
});

describe('variableToLabel', () => {
  it('joins name segments with slashes and appends the collection', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/content/primary',
      collectionName: 't2',
    });

    expect(variableToLabel(token)).toBe('color/content/primary · t2');
  });

  it('omits the collection when it could not be resolved', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo({
      name: 'gray/900',
      collectionName: '',
      tier: 'unknown',
    });

    expect(variableToLabel(token)).toBe('gray/900');
  });
});
