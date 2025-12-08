import {
  fetchFigmaJsonApiV1,
  type FetchFigmaJsonApiV1ForConsumerOptions,
} from '../fetch-figma-json-api-v1.ts';
import { type FigmaVariables } from './types/figma-variables.ts';

/* GET FIGMA VARIABLES  */

export interface GetFigmaPublishedVariablesOptions extends FetchFigmaJsonApiV1ForConsumerOptions {
  readonly fileKey: string;
}

export async function getFigmaPublishedVariables({
  fileKey,
  ...options
}: GetFigmaPublishedVariablesOptions): Promise<FigmaVariables> {
  const data: FigmaVariables | number = await fetchFigmaJsonApiV1<FigmaVariables | number>({
    ...options,
    path: `/files/${fileKey}/variables/published`,
  });

  if (typeof data === 'number') {
    throw new Error(`Error retrieving document from API: ${data}`);
  }

  return data;
}
