import { afterEach, describe, expect, it } from 'vitest';
import { getRecordEnvVariable } from './get-record-env-variable.ts';

const TEST_VAR: string = 'TEST_RECORD_ENV_VAR';

afterEach(() => {
  delete process.env[TEST_VAR];
});

describe('getRecordEnvVariable', () => {
  it('returns parsed record when env var contains valid JSON string record', () => {
    process.env[TEST_VAR] = JSON.stringify({ a: 'b', c: 'd' });
    expect(getRecordEnvVariable(TEST_VAR, {})).toEqual({ a: 'b', c: 'd' });
  });

  it('returns default value when env var is missing and default is provided', () => {
    delete process.env[TEST_VAR];
    expect(getRecordEnvVariable(TEST_VAR, { fallback: 'value' })).toEqual({
      fallback: 'value',
    });
  });

  it('returns empty object when env var is missing and default is empty', () => {
    delete process.env[TEST_VAR];
    expect(getRecordEnvVariable(TEST_VAR, {})).toEqual({});
  });

  it('throws when env var is missing and no default is provided', () => {
    delete process.env[TEST_VAR];
    expect(() => getRecordEnvVariable(TEST_VAR)).toThrow(`Missing .env variable "${TEST_VAR}"`);
  });

  it('throws when env var is a JSON array instead of an object', () => {
    process.env[TEST_VAR] = JSON.stringify(['a', 'b']);
    expect(() => getRecordEnvVariable(TEST_VAR, {})).toThrow();
  });

  it('throws when env var contains a record with non-string values', () => {
    process.env[TEST_VAR] = JSON.stringify({ a: 1 });
    expect(() => getRecordEnvVariable(TEST_VAR, {})).toThrow();
  });

  it('throws when env var is JSON null', () => {
    process.env[TEST_VAR] = JSON.stringify(null);
    expect(() => getRecordEnvVariable(TEST_VAR, {})).toThrow();
  });
});
