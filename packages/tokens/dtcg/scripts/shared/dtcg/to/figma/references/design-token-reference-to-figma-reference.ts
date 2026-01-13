import type { DesignTokenReference } from '../../../design-token/reference/design-token-reference.ts';
import { isCurlyReference } from '../../../design-token/reference/types/curly/is-curly-reference.ts';

export function designTokenReferenceToFigmaReference(reference: DesignTokenReference): string {
  if (isCurlyReference(reference)) {
    return reference;
  } else {
    throw 'TODO'; // TODO support json ref
  }
}
