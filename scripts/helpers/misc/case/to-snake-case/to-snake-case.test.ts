import { describe, expect, it } from 'vitest';
import { toSnakeCase } from './to-snake-case.ts';

describe('toSnakeCase', () => {
  it('should convert from camelCase to snake_case', () => {
    expect(toSnakeCase('aliceBob')).toBe('alice_bob');
  });

  it('should convert from PascalCase to snake_case', () => {
    expect(toSnakeCase('AliceBob')).toBe('alice_bob');
  });

  it('should convert spaces to snake_case', () => {
    expect(toSnakeCase('Alice Bob')).toBe('alice_bob');
  });

  it('should convert a string to snake_case', () => {
    expect(toSnakeCase('Alice+++bob')).toBe('alice_bob');
  });

  it('should remove consecutive snakees', () => {
    expect(toSnakeCase('Alice---Bob')).toBe('alice_bob');
  });

  it('should support numbers', () => {
    expect(toSnakeCase('font-size-2xl')).toBe('font_size_2xl');
  });
});
