import { describe, expect, it } from 'vitest';
import { toCamelCase } from './to-camel-case.ts';

describe('toCamelCase', () => {
  it('should convert from dash-case to camelCase', () => {
    expect(toCamelCase('alice-bob')).toBe('aliceBob');
  });

  it('should convert from PascalCase to camelCase', () => {
    expect(toCamelCase('AliceBob')).toBe('aliceBob');
  });

  it('should convert spaces to camelCase', () => {
    expect(toCamelCase('Alice Bob')).toBe('aliceBob');
  });

  it('should convert a string to camelCase', () => {
    expect(toCamelCase('Alice+++bob')).toBe('aliceBob');
  });

  it('should remove starting digits', () => {
    expect(toCamelCase('123AliceBob')).toBe('aliceBob');
  });

  it('should support numbers', () => {
    expect(toCamelCase('font-size-2xl')).toBe('fontSize2xl');
  });
});
