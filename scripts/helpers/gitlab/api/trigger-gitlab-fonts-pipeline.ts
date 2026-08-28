export interface TriggerGitlabFontsPipelineOptions {
  readonly url: string;
  readonly token: string;
  readonly ref: string;
  readonly variables: Readonly<Record<string, string>>;
}

export async function triggerGitlabFontsPipeline({
  url,
  token,
  ref,
  variables,
}: TriggerGitlabFontsPipelineOptions): Promise<void> {
  const searchParameters = new URLSearchParams({ token, ref });

  for (const [name, value] of Object.entries(variables)) {
    searchParameters.set(`variables[${name}]`, value);
  }

  const response: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParameters.toString(),
  });

  if (!response.ok) {
    throw new Error(`GitLab fonts pipeline trigger failed with status ${response.status}`);
  }
}
