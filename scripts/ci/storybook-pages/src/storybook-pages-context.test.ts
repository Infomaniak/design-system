import { describe, expect, it } from 'vitest';
import { resolveStorybookPagesContext } from './storybook-pages-context.ts';

describe('resolveStorybookPagesContext', () => {
  it('returns mr context for pull_request events', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'pull_request',
        ref: 'refs/pull/42/merge',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      destinationDir: 'mr/42',
      environmentName: 'storybook-pages-mr-42',
      publicUrl: 'https://infomaniak.github.io/design-system/mr/42/',
      shouldDeploy: true,
      target: 'mr',
    });
  });

  it('returns no deployment context when pull request ref is invalid', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'pull_request',
        ref: 'refs/heads/main',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      shouldDeploy: false,
    });
  });

  it('returns develop context for develop branch', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'push',
        ref: 'refs/heads/develop',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      destinationDir: 'develop',
      environmentName: 'storybook-pages-develop',
      publicUrl: 'https://infomaniak.github.io/design-system/develop/',
      shouldDeploy: true,
      target: 'develop',
    });
  });

  it('returns main context for main branch', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'push',
        ref: 'refs/heads/main',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      destinationDir: 'main',
      environmentName: 'storybook-pages-main',
      publicUrl: 'https://infomaniak.github.io/design-system/main/',
      shouldDeploy: true,
      target: 'main',
    });
  });

  it('returns tag context for tag refs', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'push',
        ref: 'refs/tags/v1.2.3',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      destinationDir: 'tags/v1.2.3',
      environmentName: 'storybook-pages-tag-v1.2.3',
      publicUrl: 'https://infomaniak.github.io/design-system/tags/v1.2.3/',
      shouldDeploy: true,
      target: 'tag',
    });
  });

  it('sanitizes unsafe tag names', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'push',
        ref: 'refs/tags/release/2026.02.19+rc',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      destinationDir: 'tags/release-2026.02.19-rc',
      environmentName: 'storybook-pages-tag-release-2026.02.19-rc',
      publicUrl: 'https://infomaniak.github.io/design-system/tags/release-2026.02.19-rc/',
      shouldDeploy: true,
      target: 'tag',
    });
  });

  it('uses root pages url for owner.github.io repositories', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'push',
        ref: 'refs/heads/main',
        repository: 'infomaniak.github.io',
        repositoryOwner: 'infomaniak',
      }),
    ).toEqual({
      destinationDir: 'main',
      environmentName: 'storybook-pages-main',
      publicUrl: 'https://infomaniak.github.io/main/',
      shouldDeploy: true,
      target: 'main',
    });
  });

  it('returns no deployment context for unsupported refs', () => {
    expect(
      resolveStorybookPagesContext({
        eventName: 'push',
        ref: 'refs/heads/feature/new-button',
        repository: 'Infomaniak/design-system',
        repositoryOwner: 'Infomaniak',
      }),
    ).toEqual({
      shouldDeploy: false,
    });
  });
});
