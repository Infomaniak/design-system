export interface GithubCiConfig {
  readonly token: string;
  readonly job: string;
  readonly ref: string;
  readonly sha: string;
  readonly repository: string;
  readonly repository_owner: string;
  readonly repository_owner_id: string;
  readonly repositoryUrl: string;
  readonly run_id: string;
  readonly run_number: string;
  readonly retention_days: string;
  readonly run_attempt: string;
  readonly artifact_cache_size_limit: string;
  readonly repository_visibility: string;
  readonly actor_id: string;
  readonly actor: string;
  readonly workflow: string;
  readonly head_ref: string;
  readonly base_ref: string;
  readonly event_name: string | 'pull_request' | 'push';
  readonly server_url: string;
  readonly api_url: string;
  readonly graphql_url: string;
  readonly ref_name: string;
  readonly ref_protected: boolean;
  readonly ref_type: string;
  readonly secret_source: string;
  readonly event: GithubCiEvent;
  readonly workflow_ref: string;
  readonly workflow_sha: string;
  readonly repository_id: string;
  readonly triggering_actor: string;
  readonly workspace: string;
  readonly action: string;
  readonly event_path: string;
  readonly action_repository: string;
  readonly action_ref: string;
  readonly path: string;
  readonly env: string;
  readonly step_summary: string;
  readonly state: string;
  readonly output: string;
}

export interface GithubCiOrganization {
  readonly avatar_url: string;
  readonly description: string;
  readonly events_url: string;
  readonly hooks_url: string;
  readonly id: number;
  readonly issues_url: string;
  readonly login: string;
  readonly members_url: string;
  readonly node_id: string;
  readonly public_members_url: string;
  readonly repos_url: string;
  readonly url: string;
}

export interface GithubCiUser {
  readonly avatar_url: string;
  readonly events_url: string;
  readonly followers_url: string;
  readonly following_url: string;
  readonly gists_url: string;
  readonly gravatar_id: string;
  readonly html_url: string;
  readonly id: number;
  readonly login: string;
  readonly node_id: string;
  readonly organizations_url: string;
  readonly received_events_url: string;
  readonly repos_url: string;
  readonly site_admin: boolean;
  readonly starred_url: string;
  readonly subscriptions_url: string;
  readonly type: string;
  readonly url: string;
  readonly user_view_type: string;
}

export interface GithubCiLicense {
  readonly key: string;
  readonly name: string;
  readonly node_id: string;
  readonly spdx_id: string;
  readonly url: string;
}

export interface GithubCiRepository {
  readonly allow_auto_merge: boolean;
  readonly allow_forking: boolean;
  readonly allow_merge_commit: boolean;
  readonly allow_rebase_merge: boolean;
  readonly allow_squash_merge: boolean;
  readonly allow_update_branch: boolean;
  readonly archive_url: string;
  readonly archived: boolean;
  readonly assignees_url: string;
  readonly blobs_url: string;
  readonly branches_url: string;
  readonly clone_url: string;
  readonly collaborators_url: string;
  readonly comments_url: string;
  readonly commits_url: string;
  readonly compare_url: string;
  readonly contents_url: string;
  readonly contributors_url: string;
  readonly created_at: string;
  readonly custom_properties?: unknown;
  readonly default_branch: string;
  readonly delete_branch_on_merge: boolean;
  readonly deployments_url: string;
  readonly description: null;
  readonly disabled: boolean;
  readonly downloads_url: string;
  readonly events_url: string;
  readonly fork: boolean;
  readonly forks: number;
  readonly forks_count: number;
  readonly forks_url: string;
  readonly full_name: string;
  readonly git_commits_url: string;
  readonly git_refs_url: string;
  readonly git_tags_url: string;
  readonly git_url: string;
  readonly has_discussions: boolean;
  readonly has_downloads: boolean;
  readonly has_issues: boolean;
  readonly has_pages: boolean;
  readonly has_projects: boolean;
  readonly has_pull_requests: boolean;
  readonly has_wiki: boolean;
  readonly homepage: string;
  readonly hooks_url: string;
  readonly html_url: string;
  readonly id: number;
  readonly is_template: boolean;
  readonly issue_comment_url: string;
  readonly issue_events_url: string;
  readonly issues_url: string;
  readonly keys_url: string;
  readonly labels_url: string;
  readonly language: string;
  readonly languages_url: string;
  readonly license: GithubCiLicense;
  readonly merge_commit_message: string;
  readonly merge_commit_title: string;
  readonly merges_url: string;
  readonly milestones_url: string;
  readonly mirror_url: null;
  readonly name: string;
  readonly node_id: string;
  readonly notifications_url: string;
  readonly open_issues: number;
  readonly open_issues_count: number;
  readonly owner: GithubCiUser;
  readonly private: boolean;
  readonly pull_request_creation_policy: string;
  readonly pulls_url: string;
  readonly pushed_at: string;
  readonly releases_url: string;
  readonly size: number;
  readonly squash_merge_commit_message: string;
  readonly squash_merge_commit_title: string;
  readonly ssh_url: string;
  readonly stargazers_count: number;
  readonly stargazers_url: string;
  readonly statuses_url: string;
  readonly subscribers_url: string;
  readonly subscription_url: string;
  readonly svn_url: string;
  readonly tags_url: string;
  readonly teams_url: string;
  readonly topics: unknown[];
  readonly trees_url: string;
  readonly updated_at: string;
  readonly url: string;
  readonly use_squash_pr_title_as_default: boolean;
  readonly visibility: string;
  readonly watchers: number;
  readonly watchers_count: number;
  readonly web_commit_signoff_required: boolean;
}

export interface GithubCiLabel {
  readonly color: string;
  readonly default: boolean;
  readonly description: string;
  readonly id: number;
  readonly name: string;
  readonly node_id: string;
  readonly url: string;
}

export interface GithubCiBranch {
  readonly label: string;
  readonly ref: string;
  readonly repo: GithubCiRepository;
  readonly sha: string;
  readonly user: GithubCiUser;
}

export interface GithubCiPullRequestLink {
  readonly href: string;
}

export interface GithubCiPullRequestLinks {
  readonly comments: GithubCiPullRequestLink;
  readonly commits: GithubCiPullRequestLink;
  readonly html: GithubCiPullRequestLink;
  readonly issue: GithubCiPullRequestLink;
  readonly review_comment: GithubCiPullRequestLink;
  readonly review_comments: GithubCiPullRequestLink;
  readonly self: GithubCiPullRequestLink;
  readonly statuses: GithubCiPullRequestLink;
}

export interface GithubCiPullRequest {
  readonly _links: GithubCiPullRequestLinks;
  readonly active_lock_reason: null;
  readonly additions: number;
  readonly assignee: GithubCiUser;
  readonly assignees: readonly GithubCiUser[];
  readonly author_association: string;
  readonly auto_merge: null;
  readonly base: GithubCiBranch;
  readonly body: string;
  readonly changed_files: number;
  readonly closed_at: null;
  readonly comments: number;
  readonly comments_url: string;
  readonly commits: number;
  readonly commits_url: string;
  readonly created_at: string;
  readonly deletions: number;
  readonly diff_url: string;
  readonly draft: boolean;
  readonly head: GithubCiBranch;
  readonly html_url: string;
  readonly id: number;
  readonly issue_url: string;
  readonly labels: readonly GithubCiLabel[];
  readonly locked: boolean;
  readonly maintainer_can_modify: boolean;
  readonly merge_commit_sha: string;
  readonly mergeable: null;
  readonly mergeable_state: string;
  readonly merged: boolean;
  readonly merged_at: null;
  readonly merged_by: GithubCiUser;
  readonly milestone: null;
  readonly node_id: string;
  readonly number: number;
  readonly patch_url: string;
  readonly rebaseable: null;
  readonly requested_reviewers: readonly GithubCiUser[];
  readonly requested_teams: readonly unknown[];
  readonly review_comment_url: string;
  readonly review_comments: number;
  readonly review_comments_url: string;
  readonly state: string;
  readonly statuses_url: string;
  readonly title: string;
  readonly updated_at: string;
  readonly url: string;
  readonly user: GithubCiUser;
}

export interface GithubCiEvent {
  readonly action: string;
  readonly after: string;
  readonly before: string;
  readonly number: number;
  readonly organization: GithubCiOrganization;
  readonly pull_request: GithubCiPullRequest;
  readonly repository: GithubCiRepository;
  readonly sender: GithubCiUser;
}
