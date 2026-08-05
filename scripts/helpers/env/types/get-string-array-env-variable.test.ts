import { afterEach, describe, expect, it } from 'vitest';
import { getStringArrayEnvVariable } from './get-string-array-env-variable.ts';

const TEST_VAR: string = 'TEST_STRING_ARRAY_ENV_VAR';

afterEach(() => {
  delete process.env[TEST_VAR];
});

describe('getStringArrayEnvVariable', () => {
  it('returns parsed array when env var contains valid JSON string array', () => {
    process.env[TEST_VAR] = JSON.stringify(['a', 'b', 'c']);
    expect(getStringArrayEnvVariable(TEST_VAR, [])).toEqual(['a', 'b', 'c']);
  });

  it('returns default value when env var is missing and default is provided', () => {
    delete process.env[TEST_VAR];
    expect(getStringArrayEnvVariable(TEST_VAR, ['fallback'])).toEqual(['fallback']);
  });

  it('returns empty array when env var is missing and default is empty', () => {
    delete process.env[TEST_VAR];
    expect(getStringArrayEnvVariable(TEST_VAR, [])).toEqual([]);
  });

  it('throws when env var is missing and no default is provided', () => {
    delete process.env[TEST_VAR];
    expect(() => getStringArrayEnvVariable(TEST_VAR)).toThrow(
      `Missing .env variable "${TEST_VAR}"`,
    );
  });

  it('throws when env var is not a JSON array', () => {
    process.env[TEST_VAR] = JSON.stringify({ key: 'value' });
    expect(() => getStringArrayEnvVariable(TEST_VAR, [])).toThrow();
  });

  it('throws when env var contains a JSON array with non-string elements', () => {
    process.env[TEST_VAR] = JSON.stringify(['a', 1, true]);
    expect(() => getStringArrayEnvVariable(TEST_VAR, [])).toThrow();
  });
});
