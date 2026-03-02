import { describe, expect, it } from 'vitest';
import { getPublishContext } from './branch-policy.ts';

describe('getPublishContext', () => {
  it('maps push on develop to rc publish context', () => {
    expect(getPublishContext({ eventName: 'push', branchName: 'develop' })).toEqual({
      shouldPublish: true,
      tag: 'rc',
    });
  });

  it('maps push on main to stable publish context', () => {
    expect(getPublishContext({ eventName: 'push', branchName: 'main' })).toEqual({
      shouldPublish: true,
      tag: 'latest',
    });
  });

  it('maps pull request with dev label to dev publish context', () => {
    expect(
      getPublishContext({
        eventName: 'pull_request',
        branchName: 'develop',
        pullRequestLabels: ['bug', 'dev'],
      }),
    ).toEqual({
      shouldPublish: true,
      tag: 'dev',
    });
  });

  it('disables publish on pull request without dev label', () => {
    expect(
      getPublishContext({
        eventName: 'pull_request',
        branchName: 'main',
        pullRequestLabels: ['ready-for-review'],
      }),
    ).toEqual({
      shouldPublish: false,
      tag: 'dev',
    });
  });

  it('throws on unsupported branch for push', () => {
    expect(() => getPublishContext({ eventName: 'push', branchName: 'feature/x' })).toThrow(
      'Unsupported branch',
    );
  });
});
