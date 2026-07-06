import type { FigmaPath } from '../../figma-path.ts';

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
