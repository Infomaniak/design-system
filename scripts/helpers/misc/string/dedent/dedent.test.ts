import { describe, expect, it } from 'vitest';
import { dedent } from './dedent.ts';

describe('dedent', () => {
  it('should support empty first and last lines', () => {
    expect(
      dedent(`
        class A {
          a = 'b';
        }
    `),
    ).toBe(`class A {
  a = 'b';
}`);
  });

  it('should support non empty first and last lines', () => {
    expect(
      dedent(`  class A {
    a = 'b';
  }`),
    ).toBe(`class A {
  a = 'b';
}`);
  });

  it('should support one line', () => {
    expect(dedent('  a')).toBe('a');
  });

  it('should support line without indentation', () => {
    expect(dedent('a')).toBe('a');
  });

  it('should support empty string', () => {
    expect(dedent('')).toBe('');
  });

  it('should throw an error if the indentation is incorrect', () => {
    expect(() => dedent('  a\nb')).toThrow();
  });
});
