import {
  fetchFigmaJsonApiV1,
  type FetchFigmaJsonApiV1ForConsumerOptions,
} from '../fetch-figma-json-api-v1.ts';

export interface GetFigmaImagesOptions extends FetchFigmaJsonApiV1ForConsumerOptions {
  readonly fileKey: string;
  readonly ids: readonly string[];
  readonly format?: 'jpg' | 'png' | 'svg' | 'pdf'; // (default: svg)
  readonly svgSimplifyStoke?: boolean; // (default: true)
  readonly useAbsoluteBounds?: boolean; // (default: true)
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
 * `GET /images/{fileKey}`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-endpoints/#get-images-endpoint
 */
export async function getFigmaImages({
  fileKey,
  ids,
  format = 'svg',
  svgSimplifyStoke = true,
  useAbsoluteBounds = true,
  ...options
}: GetFigmaImagesOptions): Promise<FigmaImagesRecord> {
  const data: FigmaImagesResult | number = await fetchFigmaJsonApiV1<FigmaImagesResult | number>({
    ...options,
    path: `/images/${fileKey}`,
    searchParam: new URLSearchParams({
      format,
      svg_simplify_stroke: svgSimplifyStoke ? 'true' : 'false',
      use_absolute_bounds: useAbsoluteBounds ? 'true' : 'false',
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
