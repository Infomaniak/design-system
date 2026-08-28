import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { triggerGitlabFontsPipeline } from './trigger-gitlab-fonts-pipeline.ts';

describe('triggerGitlabFontsPipeline', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('sends a form-encoded POST request with token, ref and variables', async () => {
    fetchMock.mockResolvedValue(new Response('{"id":42}', { status: 201 }));

    await triggerGitlabFontsPipeline({
      url: 'https://gitlab.infomaniak.ch/api/v4/projects/123/trigger/pipeline',
      token: 'glptt-token',
      ref: 'main',
      variables: {
        ARCHIVE_NAME: 'fonts-prod-abc123d.tar.gz',
        FONT_MODE: 'prod',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe('https://gitlab.infomaniak.ch/api/v4/projects/123/trigger/pipeline');
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/x-www-form-urlencoded');

    const body = new URLSearchParams(init.body as string);

    expect(body.get('token')).toBe('glptt-token');
    expect(body.get('ref')).toBe('main');
    expect(body.get('variables[ARCHIVE_NAME]')).toBe('fonts-prod-abc123d.tar.gz');
    expect(body.get('variables[FONT_MODE]')).toBe('prod');
  });

  it('throws on non-2xx response', async () => {
    fetchMock.mockResolvedValue(new Response('Forbidden', { status: 403 }));

    await expect(
      triggerGitlabFontsPipeline({
        url: 'https://gitlab.infomaniak.ch/api/v4/projects/123/trigger/pipeline',
        token: 'glptt-token',
        ref: 'main',
        variables: { FONT_MODE: 'dev' },
      }),
    ).rejects.toThrow('GitLab fonts pipeline trigger failed with status 403');
  });
});
