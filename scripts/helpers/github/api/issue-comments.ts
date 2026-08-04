import { type Logger } from '../../log/logger.ts';
import { GITHUB_API_MAX_PAGES, GITHUB_API_PAGE_SIZE } from '../constants/github-api.constants.ts';
import { githubRequest } from './github-request.ts';
import type { GithubIssueComment } from './types.ts';

export async function listIssueComments({
  owner,
  pullRequestNumber,
  repo,
  token,
}: {
  owner: string;
  repo: string;
  pullRequestNumber: number;
  token: string;
}): Promise<readonly GithubIssueComment[]> {
  const comments: GithubIssueComment[] = [];

  for (let page: number = 1; page <= GITHUB_API_MAX_PAGES; page++) {
    const pageComments: readonly GithubIssueComment[] = await githubRequest<
      readonly GithubIssueComment[]
    >({
      method: 'GET',
      path: `/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments?per_page=${GITHUB_API_PAGE_SIZE}&page=${page}`,
      token,
    });

    if (pageComments.length === 0) {
      break;
    }

    comments.push(...pageComments);

    if (pageComments.length < GITHUB_API_PAGE_SIZE) {
      break;
    }
  }

  return comments;
}

export async function upsertComment({
  body,
  label,
  logger,
  marker,
  owner,
  pullRequestNumber,
  repo,
  token,
}: {
  body: string;
  label: string;
  logger: Logger;
  marker: string;
  owner: string;
  repo: string;
  pullRequestNumber: number;
  token: string;
}): Promise<void> {
  const comments: readonly GithubIssueComment[] = await listIssueComments({
    owner,
    pullRequestNumber,
    repo,
    token,
  });

  const existingComment: GithubIssueComment | undefined = comments.find(
    (comment: GithubIssueComment): boolean => {
      return typeof comment.body === 'string' && comment.body.includes(marker);
    },
  );

  if (existingComment !== undefined) {
    await githubRequest<undefined>({
      method: 'PATCH',
      path: `/repos/${owner}/${repo}/issues/comments/${existingComment.id}`,
      token,
      body: { body },
    });
    logger.info(`Updated ${label} PR comment (${existingComment.id}).`);
    return;
  }

  await githubRequest<undefined>({
    method: 'POST',
    path: `/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments`,
    token,
    body: { body },
  });

  logger.info(`Created ${label} PR comment.`);
}
