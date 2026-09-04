import type { LintProperty } from './lint-property.ts';

export type LintNodeType = 'FRAME' | 'GROUP' | 'TEXT' | 'SHAPE' | 'INSTANCE';

export interface LintNode {
  readonly id: string;
  readonly name: string;
  readonly type: LintNodeType;
  readonly visible: boolean;
  readonly properties: readonly LintProperty[];
  readonly children: readonly LintNode[];
}
