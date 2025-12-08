import {
  fetchFigmaJsonApiV1,
  type FetchFigmaJsonApiV1ForConsumerOptions,
} from '../fetch-figma-json-api-v1.ts';
import { type FigmaFile } from './types/figma-file.ts';

/* GET FIGMA FILE  */

export interface GetFigmaFileOptions extends FetchFigmaJsonApiV1ForConsumerOptions {
  readonly fileKey: string;
}

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
