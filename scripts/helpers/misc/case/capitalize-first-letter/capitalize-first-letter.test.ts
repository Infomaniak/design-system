import { describe, expect, it } from 'vitest';
import { capitalizeFirstLetter } from './capitalize-first-letter.ts';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter', () => {
    expect(capitalizeFirstLetter('aliceBob')).toBe('AliceBob');
  });

  it('should return an empty string for empty input', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should keep non-letter first characters unchanged', () => {
    expect(capitalizeFirstLetter('1alice')).toBe('1alice');
  });
});
