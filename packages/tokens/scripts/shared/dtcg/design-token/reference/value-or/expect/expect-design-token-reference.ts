import type { DesignTokenReference } from '../../design-token-reference.ts';
import { isDesignTokenReference } from '../../is-design-token-reference.ts';
import type { ValueOrDesignTokenReference } from '../value-or-design-token-reference.ts';

export function expectDesignTokenReference(
  value: ValueOrDesignTokenReference<unknown>,
): asserts value is DesignTokenReference {
  if (!isDesignTokenReference(value)) {
    throw new Error('Expected a reference.');
  }
}
