import type { DesignTokensTree } from '../../../../tree/design-tokens-tree.ts';
import { resolveSegmentsDesignTokenReference } from '../../segments/resolve/resolve-segments-design-token-reference.ts';
import type { CurlyDesignTokenReference } from '../curly-design-token-reference.ts';
import { curlyDesignTokenReferenceToPath } from '../to/path-design-token-reference/curly-design-token-reference-to-path.ts';

export function resolveCurlyDesignTokenReference(
  reference: CurlyDesignTokenReference,
  tree: DesignTokensTree,
): unknown {
  return resolveSegmentsDesignTokenReference(curlyDesignTokenReferenceToPath(reference), tree);
}
