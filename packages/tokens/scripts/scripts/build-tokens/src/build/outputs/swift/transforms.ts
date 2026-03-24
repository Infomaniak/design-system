import type { TransformedToken, Transform } from 'style-dictionary/types';
import { segmentKebabCase } from './helpers.ts';

/**
 * Name transform that replicates the exact naming logic from the custom DTCG framework.
 */
export const nameTransform: Transform = {
  name: 'esds/name',
  type: 'name',
  transform: (token: TransformedToken): string => {
    return token.path
      .map(segmentKebabCase)
      .filter((s: string) => s !== '' && s !== '-')
      .join('-');
  },
};
