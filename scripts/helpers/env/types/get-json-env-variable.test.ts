import { afterEach, describe, expect, it } from 'vitest';
import * as z from 'zod';
import { getJsonEnvVariable } from './get-json-env-variable.ts';

const TEST_VAR: string = 'TEST_JSON_ENV_VAR';

afterEach(() => {
  delete process.env[TEST_VAR];
});

describe('getJsonEnvVariable', () => {
  it('returns parsed value when env var contains valid JSON', () => {
    process.env[TEST_VAR] = JSON.stringify({ key: 'value' });
    expect(getJsonEnvVariable<Record<string, string>>(TEST_VAR)).toEqual({ key: 'value' });
  });

  it('returns schema-validated value when schema is provided', () => {
    process.env[TEST_VAR] = JSON.stringify(42);
    expect(getJsonEnvVariable<number>(TEST_VAR, { schema: z.number() })).toBe(42);
  });

  it('throws when schema rejects the parsed value', () => {
    process.env[TEST_VAR] = JSON.stringify('not-a-number');
    expect(() => getJsonEnvVariable<number>(TEST_VAR, { schema: z.number() })).toThrow();
  });

  it('returns default value when env var is missing and default is provided', () => {
    delete process.env[TEST_VAR];
    expect(getJsonEnvVariable(TEST_VAR, { defaultValue: 'fallback' })).toBe('fallback');
  });

  it('returns default value when env var is an empty string', () => {
    process.env[TEST_VAR] = '';
    expect(getJsonEnvVariable(TEST_VAR, { defaultValue: 'fallback' })).toBe('fallback');
  });

  it('returns default value when env var contains only whitespace', () => {
    process.env[TEST_VAR] = '   ';
    expect(getJsonEnvVariable(TEST_VAR, { defaultValue: 'fallback' })).toBe('fallback');
  });

  it('throws "Missing .env variable" when env var is missing and no default is provided', () => {
    delete process.env[TEST_VAR];
    expect(() => getJsonEnvVariable(TEST_VAR)).toThrow(`Missing .env variable "${TEST_VAR}"`);
  });

  it('throws "Missing .env variable" when env var is empty and no default is provided', () => {
    process.env[TEST_VAR] = '';
    expect(() => getJsonEnvVariable(TEST_VAR)).toThrow(`Missing .env variable "${TEST_VAR}"`);
  });

  it('throws "Invalid JSON for .env variable" with cause when env var is not valid JSON', () => {
    process.env[TEST_VAR] = 'not-json';
    expect(() => getJsonEnvVariable(TEST_VAR, { defaultValue: 'fallback' })).toThrow(
      `Invalid JSON for .env variable "${TEST_VAR}".`,
    );
  });

  it('preserves the original parse error as cause', () => {
    process.env[TEST_VAR] = 'not-json';

    expect(() => getJsonEnvVariable(TEST_VAR, { defaultValue: 'fallback' })).toThrow(
      expect.objectContaining({
        cause: expect.any(Error),
      }),
    );
  });
});
