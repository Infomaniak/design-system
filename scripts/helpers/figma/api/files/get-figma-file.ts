import {
  fetchFigmaJsonApiV1,
  type FetchFigmaJsonApiV1ForConsumerOptions,
} from '../fetch-figma-json-api-v1.ts';
import { type FigmaFile } from './types/figma-file.ts';

export interface GetFigmaFileOptions extends FetchFigmaJsonApiV1ForConsumerOptions {
  readonly fileKey: string;
}

/**
 * Gets a figma file.
 *
 * `GET /files/{fileKey}`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-endpoints/#get-files-endpoint
 */
export async function getFigmaFile({
  fileKey,
  ...options
}: GetFigmaFileOptions): Promise<FigmaFile> {
  const data: FigmaFile | number = await fetchFigmaJsonApiV1<FigmaFile | number>({
    ...options,
    path: `/files/${fileKey}`,
  });

  if (typeof data === 'number') {
    throw new Error(`Error retrieving document from API: ${data}`);
  }

  return data;
}
