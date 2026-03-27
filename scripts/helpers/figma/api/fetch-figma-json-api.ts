export interface FetchFigmaJsonApiOptions extends RequestInit {
  readonly path: string;
  readonly searchParam?: URLSearchParams;
  readonly token: string;
}

export type FetchFigmaJsonApiForConsumerOptions = Omit<
  FetchFigmaJsonApiOptions,
  'path' | 'searchParam' | keyof RequestInit
>;

export async function fetchFigmaJsonApi<GResult>({
  path,
  searchParam,
  token,
  headers,
  ...options
}: FetchFigmaJsonApiOptions): Promise<GResult> {
  const url = new URL(`https://api.figma.com${path.startsWith('/') ? path : `/${path}`}`);
  if (searchParam !== undefined) {
    url.search = searchParam.toString();
  }

  const composedHeaders = new Headers(headers);
  composedHeaders.set('X-FIGMA-TOKEN', token);

  const response: Response = await fetch(url, {
    ...options,
    headers: composedHeaders,
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} - ${response.statusText}`);
  }

  return (await response.json()) as GResult;
}
