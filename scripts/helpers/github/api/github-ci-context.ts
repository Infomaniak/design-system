import { readFile } from 'node:fs/promises';

import type { GithubEventPayload } from './types.ts';

export function parseRepository(fullName: string): { owner: string; repo: string } {
  const [owner, repo]: readonly string[] = fullName.split('/');

  if (owner === undefined || repo === undefined || owner === '' || repo === '') {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${fullName}`);
  }

  return { owner, repo };
}

export function buildRunUrl({
  serverUrl,
  repository,
  runId,
}: {
  serverUrl: string;
  repository: string;
  runId: string;
}): string {
  return `${serverUrl}/${repository}/actions/runs/${runId}`;
}

export function parseEventPayload(rawJson: unknown): GithubEventPayload {
  if (typeof rawJson !== 'object' || rawJson === null) {
    throw new Error('Invalid GitHub event payload.');
  }

  return rawJson as GithubEventPayload;
}

export async function readEventPayload(eventPath: string): Promise<GithubEventPayload> {
  const eventPayload: unknown = JSON.parse(await readFile(eventPath, { encoding: 'utf8' }));

  return parseEventPayload(eventPayload);
}
