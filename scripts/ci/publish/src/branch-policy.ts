export interface GetPublishContextOptions {
  readonly eventName: string;
  readonly branchName: string;
  readonly pullRequestLabels?: readonly string[];
}

export interface PublishContext {
  readonly shouldPublish: boolean;
  readonly tag: 'dev' | 'rc' | 'latest';
}

export function getPublishContext({
  eventName,
  branchName,
  pullRequestLabels = [],
}: GetPublishContextOptions): PublishContext {
  if (eventName === 'pull_request') {
    if (branchName !== 'main' && branchName !== 'develop') {
      throw new Error(
        `Unsupported PR target branch "${branchName}". Expected "main" or "develop".`,
      );
    }

    const shouldPublish: boolean = pullRequestLabels.includes('dev');

    return {
      shouldPublish,
      tag: 'dev',
    };
  }

  if (eventName === 'push') {
    if (branchName === 'develop') {
      return {
        shouldPublish: true,
        tag: 'rc',
      };
    }

    if (branchName === 'main') {
      return {
        shouldPublish: true,
        tag: 'latest',
      };
    }

    throw new Error(`Unsupported branch "${branchName}". Expected "main" or "develop".`);
  }

  throw new Error(`Unsupported event "${eventName}". Expected "push" or "pull_request".`);
}
