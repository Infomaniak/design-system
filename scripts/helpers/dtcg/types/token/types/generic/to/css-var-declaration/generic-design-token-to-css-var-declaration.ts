import type { GenericDesignToken } from '../../generic-design-token.ts';

export function genericDesignTokenToCssVarDeclaration(
  { $description, $deprecated }: Pick<GenericDesignToken, '$description' | '$deprecated'>,
  cssVarName: string,
  serializedValue: string,
): string {
  const comments: readonly string[] = [
    ...($description === undefined ? [] : [$description]),
    ...($deprecated === undefined || $deprecated === false
      ? []
      : [`@deprecated${typeof $deprecated === 'string' ? ` ${$deprecated}` : ''}`]),
  ];

  return [
    ...(comments.length > 0 ? ['/*', ...comments, '*/'] : []),
    `${cssVarName}: ${serializedValue};`,
  ].join('\n');
}
