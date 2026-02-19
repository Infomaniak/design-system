import { describe, expect, it } from 'vitest';
import { parseBoolean, parseInteger, parseStringArray } from './parse-value.ts';

describe('parseBoolean', () => {
  it('should return default value when value is undefined', () => {
    expect(parseBoolean(undefined, true)).toBe(true);
    expect(parseBoolean(undefined, false)).toBe(false);
  });

  it('should parse truthy values', () => {
    expect(parseBoolean('1')).toBe(true);
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('yes')).toBe(true);
    expect(parseBoolean('on')).toBe(true);
  });

  it('should parse truthy values with spaces and uppercase', () => {
    expect(parseBoolean(' TRUE ')).toBe(true);
    expect(parseBoolean(' Yes ')).toBe(true);
  });

  it('should parse non-truthy values as false', () => {
    expect(parseBoolean('0')).toBe(false);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('no')).toBe(false);
    expect(parseBoolean('off')).toBe(false);
    expect(parseBoolean('random')).toBe(false);
  });
});

describe('parseInteger', () => {
  it('should return default value when value is undefined or empty', () => {
    expect(parseInteger(undefined, 42)).toBe(42);
    expect(parseInteger('', 42)).toBe(42);
    expect(parseInteger('   ', 42)).toBe(42);
  });

  it('should parse integer values', () => {
    expect(parseInteger('12', 0)).toBe(12);
    expect(parseInteger(' 12 ', 0)).toBe(12);
    expect(parseInteger('-5', 0)).toBe(-5);
  });

  it('should return default value when value is invalid', () => {
    expect(parseInteger('abc', 10)).toBe(10);
    expect(parseInteger('NaN', 10)).toBe(10);
  });
});

describe('parseStringArray', () => {
  it('should parse a json array and keep only string values', () => {
    expect(parseStringArray('["a",1,true,"b"]')).toEqual(['a', 'b']);
  });
});
