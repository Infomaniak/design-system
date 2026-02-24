import { describe, expect, it } from 'vitest';
import { dedent } from './dedent.ts';

describe('dedent', () => {
  describe('without variables', () => {
    it('should support empty first and last lines', () => {
      expect(
        dedent`
          class A {
            a = 'b';
          }
        `,
      ).toBe(`class A {
  a = 'b';
}`);
    });

    it('should throw if first line does not start with a new line', () => {
      expect(
        () => dedent` class A {
            a = 'b';
          }
        `,
      ).toThrow();

      expect(() => dedent`a`).toThrow();
    });

    it('should throw if last line does not end with a new line followed by whitespaces', () => {
      expect(
        () => dedent`
          class A {
            a = 'b';
          }`,
      ).toThrow();
    });
  });

  describe('with variables', () => {
    it('should support variables', () => {
      expect(
        dedent`
          ${'1'}
        `,
      ).toBe('1');

      expect(
        dedent`
          a${'1'}
        `,
      ).toBe('a1');

      expect(
        dedent`
          ${'1'}b
        `,
      ).toBe('1b');

      expect(
        dedent`
          a${'1'}b
        `,
      ).toBe('a1b');

      expect(
        dedent`
          a${'1'}b
          c${'2'}d
        `,
      ).toBe('a1b\nc2d');
    });

    it('should indent variables', () => {
      const props = dedent`
        b: 1,
        c: 2,
      `;

      expect(props).toBe('b: 1,\nc: 2,');

      expect(
        dedent`
          const a = {
            ${props}
          };
        `,
      ).toBe(`const a = {
  b: 1,
  c: 2,
};`);
    });
  });
});
