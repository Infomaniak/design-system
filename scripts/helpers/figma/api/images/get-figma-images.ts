import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';

export interface GetFigmaImagesOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly file_key: string;
  readonly ids: readonly string[];
  readonly format?: 'jpg' | 'png' | 'svg' | 'pdf'; // (default: svg)
  readonly svg_simplify_stroke?: boolean; // (default: true)
  readonly use_absolute_bounds?: boolean; // (default: true)
}

interface FigmaImagesResult {
  readonly err: string | null;
  readonly images: FigmaImagesRecord;
  readonly status: number;
}

export type FigmaImagesRecord = Readonly<Record<string /* id */, string>>;

/**
 * Gets the images of a figma file.
 *
 * `GET /v1/images/{file_Key}`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-endpoints/#get-images-endpoint
 */
export async function getFigmaImages({
  file_key,
  ids,
  format = 'svg',
  svg_simplify_stroke = true,
  use_absolute_bounds = true,
  ...options
}: GetFigmaImagesOptions): Promise<FigmaImagesRecord> {
  const data: FigmaImagesResult | number = await fetchFigmaJsonApi<FigmaImagesResult | number>({
    ...options,
    path: `/v1/images/${file_key}`,
    searchParam: new URLSearchParams({
      format,
      svg_simplify_stroke: svg_simplify_stroke ? 'true' : 'false',
      use_absolute_bounds: use_absolute_bounds ? 'true' : 'false',
      ids: ids.join(','),
    }),
  });

  if (typeof data === 'number') {
    throw new Error(`Error retrieving document from API: ${data}`);
  }

  if (data.err) {
    throw new Error(`Error retrieving document from API: ${data.err}`);
  }

  return data.images;
}
