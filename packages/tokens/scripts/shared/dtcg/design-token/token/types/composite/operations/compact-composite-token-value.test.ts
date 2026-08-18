import { describe, expect, it } from 'vitest';
import { compactCompositeTokenValue } from './compact-composite-token-value.ts';

describe('compactCompositeTokenValue', () => {
  it('should return an identical object if it has fewer than two properties', () => {
    expect(
      compactCompositeTokenValue({
        a: 1,
      }),
    ).toEqual({
      a: 1,
    });
  });

  it('should return an identical object if the values are not references', () => {
    expect(
      compactCompositeTokenValue({
        a: 1,
        b: 2,
        c: 3,
      }),
    ).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });

    expect(
      compactCompositeTokenValue({
        a: '{font.size.a}',
        b: '{font.weight.b}',
        c: 3,
      }),
    ).toEqual({
      a: '{font.size.a}',
      b: '{font.weight.b}',
      c: 3,
    });
  });

  it('should return a reference if all values are references with common base', () => {
    expect(
      compactCompositeTokenValue({
        a: '{font.size.a}',
        b: '{font.size.b}',
        c: '{font.size.c}',
      }),
    ).toEqual('{font.size}');
  });

  it('should return an identical object if the values are references with a different common base', () => {
    expect(
      compactCompositeTokenValue({
        a: '{font.size.a}',
        b: '{font.weight.b}',
        c: '{font.line-height.c}',
      }),
    ).toEqual({
      a: '{font.size.a}',
      b: '{font.weight.b}',
      c: '{font.line-height.c}',
    });

    expect(
      compactCompositeTokenValue({
        a: '{font.size}',
        b: '{font.weight}',
        c: '{font.line-height}',
      }),
    ).toEqual({
      a: '{font.size}',
      b: '{font.weight}',
      c: '{font.line-height}',
    });

    expect(
      compactCompositeTokenValue({
        a: '{font.size.a}',
        b: '{font.weight}',
        c: '{font.line-height}',
      }),
    ).toEqual({
      a: '{font.size.a}',
      b: '{font.weight}',
      c: '{font.line-height}',
    });
  });
});
