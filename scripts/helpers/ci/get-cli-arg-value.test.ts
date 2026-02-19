import { describe, expect, it } from 'vitest';
import { getCliArgValue } from './get-cli-arg-value.ts';

describe('getCliArgValue', () => {
  it('returns undefined when arg is not present', () => {
    expect(getCliArgValue(['node', 'script.ts'], '--mode')).toBeUndefined();
  });

  it('returns the value for matching arg', () => {
    expect(getCliArgValue(['node', 'script.ts', '--mode=prepare'], '--mode')).toBe('prepare');
  });

  it('returns first matching value when multiple args exist', () => {
    expect(getCliArgValue(['--mode=prepare', '--mode=postbuild'], '--mode')).toBe('prepare');
  });
});
