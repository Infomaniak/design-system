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
