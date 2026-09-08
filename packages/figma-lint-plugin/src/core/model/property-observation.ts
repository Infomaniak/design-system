import type { LintNode } from './lint-node.ts';
import type { LintProperty, LintPropertyPart } from './lint-property.ts';

export interface PropertyObservation {
  readonly node: LintNode;
  readonly property: LintProperty;
  readonly part: LintPropertyPart;
}
