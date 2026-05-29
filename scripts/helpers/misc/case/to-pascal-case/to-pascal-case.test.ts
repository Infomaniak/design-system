import { describe, expect, it } from 'vitest';
import { toPascalCase } from './to-pascal-case.ts';

describe('toPascalCase', () => {
  it('should convert from dash-case to PascalCase', () => {
    expect(toPascalCase('alice-bob')).toBe('AliceBob');
  });

  it('should convert from camelCase to PascalCase', () => {
    expect(toPascalCase('aliceBob')).toBe('AliceBob');
  });

  it('should convert spaces to PascalCase', () => {
    expect(toPascalCase('Alice Bob')).toBe('AliceBob');
  });

  it('should convert a string to PascalCase', () => {
    expect(toPascalCase('Alice+++bob')).toBe('AliceBob');
  });

  it('should remove starting digits', () => {
    expect(toPascalCase('123aliceBob')).toBe('AliceBob');
  });

  it('should support numbers', () => {
    expect(toPascalCase('font-size-2xl')).toBe('FontSize2xl');
  });
});
