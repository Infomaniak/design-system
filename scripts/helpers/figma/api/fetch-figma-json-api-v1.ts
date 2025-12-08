export interface FetchFigmaJsonApiV1Options extends RequestInit {
  readonly path: string;
  readonly searchParam?: URLSearchParams;
  readonly token: string;
}

export type FetchFigmaJsonApiV1ForConsumerOptions = Omit<
  FetchFigmaJsonApiV1Options,
  'path' | 'searchParam' | keyof RequestInit
>;

export async function fetchFigmaJsonApiV1<GResult>({
  path,
  searchParam,
  token,
  headers,
  ...options
}: FetchFigmaJsonApiV1Options): Promise<GResult> {
  const url = new URL(`https://api.figma.com/v1${path.startsWith('/') ? path : `/${path}`}`);
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
