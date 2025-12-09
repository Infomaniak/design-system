import { type FigmaVariableAlias } from '../types/figma-variable-alias.ts';

export interface FigmaNode<GType extends string = any> {
  readonly id: string;
  readonly name: string;
  readonly visible?: boolean; // (default: true)
  readonly type: GType;
  readonly rotation?: number; // (default: 0)
  readonly pluginData?: any;
  readonly sharedPluginData?: any;
  readonly componentPropertyReferences?: Readonly<Record<string, string>>;
  readonly boundVariables?: Readonly<
    Record<
      string,
      FigmaVariableAlias | FigmaVariableAlias[] | Readonly<Record<string, FigmaVariableAlias>>
    >
  >;
  readonly explicitVariableModes?: Readonly<Record<string, string>>;
}
