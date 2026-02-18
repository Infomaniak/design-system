import { describe, expect, it } from 'vitest';
import { getPublishContext } from './branch-policy.ts';

describe('getPublishContext', () => {
  it('maps develop to rc', () => {
    expect(getPublishContext({ branchName: 'develop', version: '1.2.3-rc.4', strict: true })).toEqual(
      { tag: 'rc' },
    );
  });

  it('maps main to latest', () => {
    expect(getPublishContext({ branchName: 'main', version: '1.2.3', strict: true })).toEqual({
      tag: 'latest',
    });
  });

  it('throws on stable version in develop when strict', () => {
    expect(() =>
      getPublishContext({
        branchName: 'develop',
        version: '1.2.3',
        strict: true,
      }),
    ).toThrow('must be an rc version');
  });

  it('throws on rc version in main when strict', () => {
    expect(() =>
      getPublishContext({
        branchName: 'main',
        version: '1.2.3-rc.4',
        strict: true,
      }),
    ).toThrow('must be a stable version');
  });

  it('accepts stable on develop when strict mode is disabled', () => {
    expect(getPublishContext({ branchName: 'develop', version: '1.2.3', strict: false })).toEqual({
      tag: 'rc',
    });
  });
});
