import { describe, expect, it } from 'vitest';
import { dashCaseToCamelCase } from './dash-case-to-camel-case.ts';

describe('dashCaseToCamelCase', () => {
  it('should convert from dash-case to camelCase', () => {
    expect(dashCaseToCamelCase('alice-bob')).toBe('aliceBob');
  });
});
