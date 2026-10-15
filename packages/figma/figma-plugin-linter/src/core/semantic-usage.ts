import type { LintNodeType } from './model/lint-node.ts';
import type { LintPropertyKind } from './model/lint-property.ts';
import { describeRequiredProperty } from './scopes.ts';

/**
 * Semantic category of a t2 color token, derived from its name segments:
 * `color/background/…` → `background`, `color/content/…` → `content`, etc.
 */
export type ColorTokenCategory = 'background' | 'content' | 'border' | 'shadow' | 'unknown';

const KNOWN_CATEGORIES: readonly ColorTokenCategory[] = [
  'background',
  'content',
  'border',
  'shadow',
];

export function getColorTokenCategory(nameSegments: readonly string[]): ColorTokenCategory {
  const [root, category] = nameSegments;

  if (root !== 'color') {
    return 'unknown';
  }

  return (KNOWN_CATEGORIES as readonly string[]).includes(category)
    ? (category as ColorTokenCategory)
    : 'unknown';
}

/**
 * Whether a t2 color category may be used on a checked property of a node type.
 * `unknown` categories are always allowed (the wrong-token rule never flags what
 * it cannot classify).
 */
export function isAllowedColorUsage(
  category: ColorTokenCategory,
  kind: LintPropertyKind,
  nodeType: LintNodeType,
): boolean {
  switch (category) {
    case 'background':
      return kind === 'fill' && nodeType !== 'TEXT';
    case 'content':
      return kind === 'fill' && nodeType !== 'FRAME';
    case 'border':
      return kind === 'stroke';
    case 'shadow':
    case 'unknown':
      return false;
  }
}

/**
 * Rule message explaining why a category doesn't match the observed property.
 */
export function describeWrongColorUsage(
  category: Exclude<ColorTokenCategory, 'unknown'>,
  kind: LintPropertyKind,
  nodeType: LintNodeType,
): string {
  const categoryHint: string = CATEGORY_HINTS[category];
  const observedHint: string = describeRequiredProperty(kind, nodeType);

  return `\`color/${category}\` tokens are for ${categoryHint} — not for ${observedHint}.`;
}

const CATEGORY_HINTS: Readonly<Record<Exclude<ColorTokenCategory, 'unknown'>, string>> = {
  background: 'backgrounds (frame and shape fills)',
  content: 'text and icon colors',
  border: 'strokes',
  shadow: 'shadow effects',
};
