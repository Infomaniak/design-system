import type { ExplicitAny } from '../../../../types/explicit-any.ts';
import type { FigmaVariableAlias } from '../types/figma-variable-alias.ts';

export interface FigmaNode<GType extends string> {
  readonly id: string;
  readonly name: string;
  readonly visible?: boolean; // (default: true)
  readonly type: GType;
  readonly rotation?: number; // (default: 0)
  readonly pluginData?: unknown;
  readonly sharedPluginData?: unknown;
  readonly componentPropertyReferences?: Readonly<Record<string, string>>;
  readonly boundVariables?: Readonly<
    Record<
      string,
      FigmaVariableAlias | FigmaVariableAlias[] | Readonly<Record<string, FigmaVariableAlias>>
    >
  >;
  readonly explicitVariableModes?: Readonly<Record<string, string>>;
}

export type GenericFigmaNode = FigmaNode<ExplicitAny>;
