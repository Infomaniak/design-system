import type {
  GithubCiConfig,
  GithubCiLabel,
} from '../../../../helpers/github/github-ci-config/github-ci-config.ts';
import type { PublishMode } from '../../../../helpers/publish/publish-mode/publish-mode.ts';

export interface CiPublishContext {
  readonly branchName: string;
  readonly mode: PublishMode;
  readonly shouldPublish: boolean;
}

export function inferCiPublishContext(githubCiConfig: GithubCiConfig): CiPublishContext {
  let branchName: string;
  let mode: PublishMode;
  let shouldPublish: boolean;

  if (githubCiConfig.event_name === 'pull_request') {
    branchName = verifyBranchTargetsMainOrDevelop(githubCiConfig.base_ref);
    mode = 'dev';
    shouldPublish = githubCiConfig.event.pull_request.labels.some(
      (label: GithubCiLabel): boolean => {
        return label.name === 'dev';
      },
    );
  } else if (githubCiConfig.event_name === 'push') {
    branchName = verifyBranchTargetsMainOrDevelop(githubCiConfig.ref_name);
    mode = branchName === 'develop' ? 'rc' : 'prod';
    shouldPublish = true;
  } else {
    throw new Error(
      `Unsupported event "${githubCiConfig.event_name}". Expected "push" or "pull_request".`,
    );
  }

  return {
    branchName,
    mode,
    shouldPublish,
  };
}

function verifyBranchTargetsMainOrDevelop(branchName: string): string {
  if (branchName !== 'main' && branchName !== 'develop') {
    throw new Error('`main` or `develop` expected as target branch.');
  }

  return branchName;
}
