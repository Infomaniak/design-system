export type StorybookPagesTarget = 'mr' | 'develop' | 'main' | 'tag';

export interface ResolveStorybookPagesContextInput {
  readonly eventName: string;
  readonly ref: string;
  readonly repository: string;
  readonly repositoryOwner: string;
}

export interface StorybookPagesDeployContext {
  readonly shouldDeploy: true;
  readonly target: StorybookPagesTarget;
  readonly destinationDir: string;
  readonly publicUrl: string;
  readonly environmentName: string;
}

export interface StorybookPagesNoDeployContext {
  readonly shouldDeploy: false;
}

export type StorybookPagesContext = StorybookPagesDeployContext | StorybookPagesNoDeployContext;

function getPullRequestNumberFromRef(ref: string): string | undefined {
  const match: RegExpMatchArray | null = ref.match(/^refs\/pull\/(\d+)\/merge$/);

  if (match === null) {
    return undefined;
  }

  const pullRequestNumber: string | undefined = match[1];

  if (pullRequestNumber === undefined || pullRequestNumber.trim() === '') {
    return undefined;
  }

  return pullRequestNumber;
}

function sanitizeSegment(value: string): string {
  const trimmed: string = value.trim();

  if (trimmed === '') {
    return 'unknown';
  }

  const sanitized: string = trimmed
    .replaceAll('/', '-')
    .replaceAll(' ', '-')
    .replaceAll('+', '-')
    .replaceAll(':', '-')
    .replace(/[^A-Za-z0-9._-]/g, '-')
    .replace(/-+/g, '-');

  return sanitized === '' ? 'unknown' : sanitized;
}

function getPagesBaseUrl({
  repository,
  repositoryOwner,
}: {
  repository: string;
  repositoryOwner: string;
}): string {
  const repositoryName: string = repository.includes('/')
    ? (repository.split('/')[1] ?? repository)
    : repository;
  const ownerLowerCase: string = repositoryOwner.toLowerCase();
  const repositoryLowerCase: string = repositoryName.toLowerCase();
  const ownerSiteRepository: string = `${ownerLowerCase}.github.io`;

  if (repositoryLowerCase === ownerSiteRepository) {
    return `https://${ownerLowerCase}.github.io`;
  }

  return `https://${ownerLowerCase}.github.io/${repositoryName}`;
}

function createDeployContext({
  destinationDir,
  environmentName,
  repository,
  repositoryOwner,
  target,
}: {
  target: StorybookPagesTarget;
  destinationDir: string;
  environmentName: string;
  repository: string;
  repositoryOwner: string;
}): StorybookPagesDeployContext {
  const baseUrl: string = getPagesBaseUrl({ repository, repositoryOwner });
  const normalizedDestinationDir: string = destinationDir.replace(/^\/+|\/+$/g, '');

  return {
    shouldDeploy: true,
    target,
    destinationDir: normalizedDestinationDir,
    publicUrl: `${baseUrl}/${normalizedDestinationDir}/`,
    environmentName,
  };
}

export function resolveStorybookPagesContext({
  eventName,
  ref,
  repository,
  repositoryOwner,
}: ResolveStorybookPagesContextInput): StorybookPagesContext {
  if (eventName === 'pull_request') {
    const pullRequestNumber: string | undefined = getPullRequestNumberFromRef(ref);

    if (pullRequestNumber === undefined) {
      return {
        shouldDeploy: false,
      };
    }

    return createDeployContext({
      target: 'mr',
      destinationDir: `mr/${pullRequestNumber}`,
      environmentName: `storybook-pages-mr-${pullRequestNumber}`,
      repository,
      repositoryOwner,
    });
  }

  if (ref === 'refs/heads/develop') {
    return createDeployContext({
      target: 'develop',
      destinationDir: 'develop',
      environmentName: 'storybook-pages-develop',
      repository,
      repositoryOwner,
    });
  }

  if (ref === 'refs/heads/main') {
    return createDeployContext({
      target: 'main',
      destinationDir: 'main',
      environmentName: 'storybook-pages-main',
      repository,
      repositoryOwner,
    });
  }

  if (ref.startsWith('refs/tags/')) {
    const rawTagName: string = ref.slice('refs/tags/'.length);
    const tagName: string = sanitizeSegment(rawTagName);

    return createDeployContext({
      target: 'tag',
      destinationDir: `tags/${tagName}`,
      environmentName: `storybook-pages-tag-${tagName}`,
      repository,
      repositoryOwner,
    });
  }

  return {
    shouldDeploy: false,
  };
}
