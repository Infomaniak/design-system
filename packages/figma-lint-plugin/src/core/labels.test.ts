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

    expect(getObservationPropertyLabel(observation(node, fills, fills.parts[0]!))).toBe('Fill');
    expect(getObservationPropertyLabel(observation(node, strokes, strokes.parts[0]!))).toBe(
      'Stroke',
    );
    expect(getObservationPropertyLabel(observation(node, radius, radius.parts[0]!))).toBe(
      'Corner radius',
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
