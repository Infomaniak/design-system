import type { FigmaPaint } from './figma-paint.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#paintoverride-type
 */
export interface FigmaPaintOverride {
  readonly fills: readonly FigmaPaint[];
  readonly inheritFillStyleId: string;
}
