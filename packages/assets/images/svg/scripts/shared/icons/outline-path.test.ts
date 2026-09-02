import { describe, expect, test } from 'vitest';
import { parseWindingRule } from './outline-path.ts';

describe('outline-path', () => {
  test('parses the supported winding rules', () => {
    expect(parseWindingRule('NONZERO')).toBe('NONZERO');
    expect(parseWindingRule('EVENODD')).toBe('EVENODD');
  });

  test('throws on an unexpected winding rule', () => {
    expect(() => parseWindingRule('INVERTED')).toThrow('Unexpected winding rule: "INVERTED".');
  });
});
