import type { LintProperty } from './lint-property.ts';

export type LintNodeType = 'FRAME' | 'GROUP' | 'TEXT' | 'SHAPE' | 'INSTANCE';

export interface LintNode {
  readonly id: string;
  readonly name: string;
  readonly type: LintNodeType;
  readonly visible: boolean;
  readonly properties: readonly LintProperty[];
  readonly children: readonly LintNode[];
  /**
   * True when the node lives inside a component instance from the DS icon
   * library (`esds/icon/…`): the library carries its own token collection, so
   * tier-classifying rules exempt these bindings.
   */
  readonly fromIconLibrary?: boolean;
}
