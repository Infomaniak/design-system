import type { ColorDesignTokenValue } from '../../../color-design-token-value.ts';

export function serializeColorDesignTokenValueComponents({
  components,
  alpha,
}: Pick<ColorDesignTokenValue, 'components' | 'alpha'>): string {
  return `${components.join(' ')}${alpha === undefined ? '' : ` / ${alpha}`}`;
}
