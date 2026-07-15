import type { FigmaPath } from '../../figma-path.ts';

/**
 * Converts a FigmaPath object into an SVG path string.
 *
 * @param {FigmaPath} figmaPath - The FigmaPath object to be converted.
 * @param {string} [extraAttributes=''] - Additional attributes to include in the SVG path element.
 * @return {string} The generated SVG path string.
 */
export function figmaPathToSvgPath(
  { path, windingRule }: FigmaPath,
  extraAttributes: string = '',
): string {
  const attributes: string[] = [`d="${path}"`];

  if (windingRule === 'EVENODD') {
    attributes.push('fill-rule="evenodd"');
  }

  if (extraAttributes !== '') {
    attributes.push(extraAttributes);
  }

  return `<path ${attributes.join(' ')} />`;
}
