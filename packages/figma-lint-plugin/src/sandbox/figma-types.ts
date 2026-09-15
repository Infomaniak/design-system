/**
 * Minimal structural types for the Figma plugin API surface this plugin reads.
 * Hand-rolled on purpose: keeps the root tsconfig clean (no global type
 * pollution) and lets every layer run in plain Vitest without the `figma`
 * global.
 *
 * `figma.mixed` is a unique symbol — any `| symbol` below models a mixed
 * (multi-value) field, which v1 skips.
 */

export interface FigmaRgba {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export interface FigmaVariableAlias {
  readonly type: 'VARIABLE_ALIAS';
  readonly id: string;
}

export interface FigmaPaintBoundVariables {
  readonly color?: FigmaVariableAlias;
}

export interface FigmaPaint {
  readonly type: string;
  readonly visible?: boolean;
  readonly color?: FigmaRgba;
  readonly imageHash?: string;
  readonly gradientTransform?: readonly (readonly number[])[];
  readonly gradientStops?: readonly unknown[];
  readonly boundVariables?: FigmaPaintBoundVariables;
}

export interface FigmaNodeBoundVariables {
  readonly paddingLeft?: FigmaVariableAlias;
  readonly paddingRight?: FigmaVariableAlias;
  readonly paddingTop?: FigmaVariableAlias;
  readonly paddingBottom?: FigmaVariableAlias;
  readonly itemSpacing?: FigmaVariableAlias;
  readonly cornerRadius?: FigmaVariableAlias;
  readonly topLeftRadius?: FigmaVariableAlias;
  readonly topRightRadius?: FigmaVariableAlias;
  readonly bottomLeftRadius?: FigmaVariableAlias;
  readonly bottomRightRadius?: FigmaVariableAlias;
}

export interface FigmaNode {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly visible?: boolean;
  readonly children?: readonly FigmaNode[];
  readonly fills?: readonly FigmaPaint[] | symbol;
  readonly strokes?: readonly FigmaPaint[] | symbol;
  readonly boundVariables?: FigmaNodeBoundVariables;
  readonly paddingLeft?: number | symbol;
  readonly paddingRight?: number | symbol;
  readonly paddingTop?: number | symbol;
  readonly paddingBottom?: number | symbol;
  readonly itemSpacing?: number | symbol;
  readonly cornerRadius?: number | symbol;
  readonly topLeftRadius?: number | symbol;
  readonly topRightRadius?: number | symbol;
  readonly bottomLeftRadius?: number | symbol;
  readonly bottomRightRadius?: number | symbol;
}

export type FigmaVariableResolvedType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

export interface FigmaVariable {
  readonly id: string;
  readonly name: string;
  readonly resolvedType: FigmaVariableResolvedType;
  readonly scopes: readonly string[];
  readonly variableCollectionId: string;
  /**
   * The variable's value: a raw value (rgba, number, string, boolean) or a
   * `VARIABLE_ALIAS` when the variable is itself bound to another variable.
   * Untyped on purpose — raw value shapes are irrelevant; only aliases are read.
   */
  readonly value?: unknown;
}

export function isFigmaVariableAlias(value: unknown): value is FigmaVariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as FigmaVariableAlias).type === 'VARIABLE_ALIAS' &&
    typeof (value as FigmaVariableAlias).id === 'string'
  );
}

export interface FigmaVariableCollection {
  readonly id: string;
  readonly name: string;
}

export interface FigmaVariablesApi {
  getLocalVariablesAsync(): Promise<readonly FigmaVariable[]>;
  getLocalVariableCollectionsAsync(): Promise<readonly FigmaVariableCollection[]>;
  /** Resolves any bound variable by id, including variables from published libraries. */
  getVariableByIdAsync(variableId: string): Promise<FigmaVariable | null>;
  getVariableCollectionByIdAsync(collectionId: string): Promise<FigmaVariableCollection | null>;
}

/** Sandbox-side plugin API surface used by `code.ts`. */
export interface FigmaSandboxApi {
  showUI(
    html: string,
    options?: { readonly width?: number; readonly height?: number; readonly themeColors?: boolean },
  ): void;
  readonly ui: {
    onmessage: ((message: unknown) => void) | null;
    postMessage(message: unknown): void;
  };
  readonly currentPage: { selection: unknown[] };
  getNodeByIdAsync(nodeId: string): Promise<{ readonly id: string; readonly name: string } | null>;
  readonly viewport: { scrollAndZoomIntoView(nodes: readonly unknown[]): void };
  readonly variables: FigmaVariablesApi;
}
