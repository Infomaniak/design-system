import { describe, expect, it } from 'vitest';
import { toDashCase } from './to-dash-case.ts';

describe('toDashCase', () => {
  it('should convert from camelCase to dash-case', () => {
    expect(toDashCase('aliceBob')).toBe('alice-bob');
  });

  it('should convert from PascalCase to dash-case', () => {
    expect(toDashCase('AliceBob')).toBe('alice-bob');
  });

  it('should convert spaces to dash-case', () => {
    expect(toDashCase('Alice Bob')).toBe('alice-bob');
  });

  it('should convert a string to dash-case', () => {
    expect(toDashCase('Alice+++bob')).toBe('alice-bob');
  });

  it('should remove consecutive dashes', () => {
    expect(toDashCase('Alice---Bob')).toBe('alice-bob');
  });
});
