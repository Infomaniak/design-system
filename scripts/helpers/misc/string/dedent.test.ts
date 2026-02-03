import { describe, expect, it } from 'vitest';
import { dedent } from './dedent.ts';

describe('dedent', () => {
  it('should dedent string', () => {
    expect(
      dedent(`
      class A {
        a = 'b';
      }
    `),
    ).toBe(1);
  });
});
