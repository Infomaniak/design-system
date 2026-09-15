export interface GithubIssueComment {
  readonly id: number;
  readonly body: string | null;
}

export interface GithubPullRequestSummary {
  readonly number: number;
  readonly draft: boolean;
}

export interface GithubEventPayload {
  readonly pull_request?: GithubPullRequestSummary;
}

export interface GithubRelease {
  readonly id: number;
  readonly tag_name: string;
  readonly name: string | null;
  readonly html_url: string;
  readonly draft: boolean;
  readonly prerelease: boolean;
}

export interface GithubReleaseAsset {
  readonly id: number;
  readonly name: string;
  readonly size: number;
  readonly browser_download_url: string;
}
