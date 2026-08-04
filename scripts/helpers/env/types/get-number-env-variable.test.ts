import { afterEach, describe, expect, it } from 'vitest';
import { getNumberEnvVariable } from './get-number-env-variable.ts';

const TEST_VAR: string = 'TEST_NUMBER_ENV_VAR';

afterEach(() => {
  delete process.env[TEST_VAR];
});

describe('getNumberEnvVariable', () => {
  it('returns parsed number when env var contains valid JSON number', () => {
    process.env[TEST_VAR] = JSON.stringify(12.5);
    expect(getNumberEnvVariable(TEST_VAR, 0)).toBe(12.5);
  });

  it('returns parsed negative number', () => {
    process.env[TEST_VAR] = JSON.stringify(-3);
    expect(getNumberEnvVariable(TEST_VAR, 0)).toBe(-3);
  });

  it('returns default value when env var is missing and default is provided', () => {
    delete process.env[TEST_VAR];
    expect(getNumberEnvVariable(TEST_VAR, 42)).toBe(42);
  });

  it('returns zero when env var is missing and default is zero', () => {
    delete process.env[TEST_VAR];
    expect(getNumberEnvVariable(TEST_VAR, 0)).toBe(0);
  });

  it('throws when env var is missing and no default is provided', () => {
    delete process.env[TEST_VAR];
    expect(() => getNumberEnvVariable(TEST_VAR)).toThrow(`Missing .env variable "${TEST_VAR}"`);
  });

  it('throws when env var is not a JSON number', () => {
    process.env[TEST_VAR] = JSON.stringify({ key: 'value' });
    expect(() => getNumberEnvVariable(TEST_VAR, 0)).toThrow();
  });

  it('throws when env var contains NaN', () => {
    process.env[TEST_VAR] = JSON.stringify(NaN);
    expect(() => getNumberEnvVariable(TEST_VAR, 0)).toThrow();
  });

  it('throws when env var contains Infinity', () => {
    process.env[TEST_VAR] = JSON.stringify(Infinity);
    expect(() => getNumberEnvVariable(TEST_VAR, 0)).toThrow();
  });
});
