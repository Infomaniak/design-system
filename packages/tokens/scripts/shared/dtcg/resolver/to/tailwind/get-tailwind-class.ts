import type { ArrayDesignTokenName } from '../../../token/name/array-design-token-name.ts';
import { arrayDesignTokenNameToCssVariableSegments } from '../css/token/name/array-design-token-name-to-css-variable-segments.ts';

/**
 * Maps a design token name to its closest Tailwind CSS utility class(es).
 *
 * **Supported token categories**
 * | Token prefix | Tailwind mapping |
 * |---|---|
 * | `color.background.*` | `bg-{rest}` |
 * | `color.content.*` | `text-{rest}` |
 * | `color.border.*` | `border-{rest}` |
 * | `color.*` (fallback) | `bg-{rest}` |
 * | `font.family.*` | `font-{rest}` |
 * | `font.size.*` | `text-{rest}` |
 * | `font.line-height.*` | `leading-{rest}` |
 * | `font.weight.*` | `font-{rest}` |
 * | `font.letter-spacing.*` | `tracking-{rest}` |
 * | `text.*.size` | `text-{rest}` |
 * | `text.*.line-height` | `leading-{rest}` |
 * | `text.*.letter-spacing` | `tracking-{rest}` |
 * | `radius.*` | `rounded-{rest}` |
 * | `blur.*` | `blur-{rest}` |
 * | `spacing.*` | `p-{rest}` / `m-{rest}` / `gap-{rest}` |
 * | `shadow.*` | `shadow-{rest}` |
 * | `opacity.*` | `opacity-{rest}` |
 * | `border.*.width` | `border-{rest}` |
 *
 * Returns `null` when no meaningful Tailwind equivalent exists.
 */
export function getTailwindClass(tokenName: ArrayDesignTokenName): string[] | null {
  const tokenNameStr = tokenName.join('.');

  if (tokenNameStr.startsWith('color.')) {
    const colorCategory = tokenName[1];
    const rest = arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1));

    if (colorCategory === 'background') {
      return [`bg-${rest}`];
    }

    if (colorCategory === 'content') {
      return [`text-${rest}`];
    }

    if (colorCategory === 'border') {
      return [`border-${rest}`];
    }

    return [`bg-${rest}`];
  }

  if (tokenNameStr.startsWith('font.family.')) {
    return [`font-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(2))}`];
  }

  if (tokenNameStr.startsWith('font.size.')) {
    return [`text-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(2))}`];
  }

  if (tokenNameStr.startsWith('font.line-height.')) {
    return [`leading-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(2))}`];
  }

  if (tokenNameStr.startsWith('font.weight.')) {
    return [`font-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(2))}`];
  }

  if (tokenNameStr.startsWith('font.letter-spacing.')) {
    return [`tracking-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(2))}`];
  }

  if (tokenNameStr.startsWith('text.')) {
    if (tokenNameStr.endsWith('.size')) {
      return [`text-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1, -1))}`];
    }

    if (tokenNameStr.endsWith('.line-height')) {
      return [`leading-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1, -1))}`];
    }

    if (tokenNameStr.endsWith('.letter-spacing')) {
      return [`tracking-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1, -1))}`];
    }

    return null;
  }

  if (tokenNameStr.startsWith('radius.')) {
    return [`rounded-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1))}`];
  }

  if (tokenNameStr.startsWith('blur.')) {
    return [`blur-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1))}`];
  }

  if (tokenNameStr.startsWith('spacing.')) {
    const rest = arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1));

    return [`p-${rest}`, `m-${rest}`, `gap-${rest}`];
  }

  if (tokenNameStr.startsWith('shadow.')) {
    return [`shadow-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1))}`];
  }

  if (tokenNameStr.startsWith('opacity.')) {
    return [`opacity-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1))}`];
  }

  if (tokenNameStr.startsWith('border.')) {
    if (tokenNameStr.endsWith('.width')) {
      return [`border-${arrayDesignTokenNameToCssVariableSegments(tokenName.slice(1, -1))}`];
    }

    return null;
  }

  return null;
}
