export interface GetPublishContextOptions {
  readonly branchName: string;
  readonly version: string;
  readonly strict: boolean;
}

export interface PublishContext {
  readonly tag: 'rc' | 'latest';
}

const RC_VERSION_REGEXP: RegExp = /^\d+\.\d+\.\d+-rc\.\d+$/;
const STABLE_VERSION_REGEXP: RegExp = /^\d+\.\d+\.\d+$/;

export function getPublishContext({
  branchName,
  version,
  strict,
}: GetPublishContextOptions): PublishContext {
  if (branchName === 'develop') {
    if (strict && !RC_VERSION_REGEXP.test(version)) {
      throw new Error(
        `Version "${version}" must be an rc version (x.y.z-rc.n) on "develop" branch.`,
      );
    }

    return { tag: 'rc' };
  }

  if (branchName === 'main') {
    if (strict && !STABLE_VERSION_REGEXP.test(version)) {
      throw new Error(`Version "${version}" must be a stable version (x.y.z) on "main" branch.`);
    }

    return { tag: 'latest' };
  }

  throw new Error(`Unsupported branch "${branchName}". Expected "main" or "develop".`);
}
