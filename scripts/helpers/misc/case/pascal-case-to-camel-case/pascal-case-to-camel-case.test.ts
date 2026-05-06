import { describe, expect, it } from 'vitest';
import { pascalCaseToCamelCase } from './pascal-case-to-camel-case.ts';

describe('pascalCaseToCamelCase', () => {
  it('should convert from PascalCase to camelCase', () => {
    expect(pascalCaseToCamelCase('AliceBob')).toBe('aliceBob');
  });
});
