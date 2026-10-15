/**
 * Figma plugin API types.
 *
 * The **API surfaces** (the `figma` global, variables, styles, library
 * descriptors) come from the official `@figma/plugin-typings` package via the
 * ambient declarations pulled in by `src/figma-env.d.ts` — the hand-rolled
 * mirrors that used to live here drifted from the real runtime four times in
 * one release cycle (`valuesByMode` shape, the dynamic-page `mainComponent`
 * ban, the teamLibrary method names, the manifest permission), which is
 * exactly what the official typings prevent.
 *
 * The types exported below are either aliases onto the official ambient
 * interfaces or the structural types that stay hand-rolled on purpose:
 * - `AnyFigmaNode` (+ its permissive `FigmaPaint`/`FigmaEffect` read shapes)
 *   is a deliberately permissive read shape: the adapter and the
 *   instance-identity collector traverse ANY node kind and read a union of
 *   properties without narrowing — the official per-node interfaces would
 *   force narrowing churn with no safety gain.
 * - `FixableNode` is the minimal write surface for fix application.
 *
 * `figma.mixed` is a unique symbol — any `| symbol` below models a mixed
 * (multi-value) field, which the plugin skips.
 */

export type FigmaVariableAlias = VariableAlias;

/**
 * Permissive read shapes for paints and effects: the adapter reads any node
 * kind's paint/effect arrays without narrowing to the official unions (whose
 * members carry required write-oriented fields). Runtime shapes match.
 */
export interface FigmaRgba {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export interface FigmaPaint {
  readonly type: string;
  readonly visible?: boolean;
  readonly color?: FigmaRgba;
  readonly imageHash?: string;
  readonly gradientTransform?: readonly (readonly number[])[];
  readonly gradientStops?: readonly unknown[];
  readonly boundVariables?: { readonly color?: FigmaVariableAlias };
}

export interface FigmaEffect {
  readonly type: string;
  readonly visible?: boolean;
  readonly color?: FigmaRgba;
  readonly radius?: number;
  readonly offset?: { readonly x: number; readonly y: number };
  readonly spread?: number;
  readonly boundVariables?: { readonly color?: FigmaVariableAlias };
}

/** Deliberately permissive read shape for any Figma node (see module docblock). */
export interface AnyFigmaNode {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly visible?: boolean;
  readonly children?: readonly AnyFigmaNode[];
  readonly fills?: readonly FigmaPaint[] | symbol;
  readonly strokes?: readonly FigmaPaint[] | symbol;
  readonly boundVariables?: {
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
    readonly strokeWeight?: FigmaVariableAlias;
  };
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
  readonly strokeWeight?: number | symbol;
  readonly opacity?: number | symbol;
  readonly blendMode?: string | symbol;
  readonly characters?: string | symbol;
  readonly fontSize?: number | symbol;
  readonly fontName?: { readonly family: string; readonly style: string } | symbol;
  readonly textDecoration?: string | symbol;
  readonly lineHeight?: { readonly value: number; readonly unit: string } | symbol;
  readonly effects?: readonly FigmaEffect[] | symbol;
  readonly effectStyleId?: string | symbol;
  readonly textStyleId?: string | symbol;
  /** Plain tree access (sync-safe in dynamic-page mode, unlike `mainComponent`). */
  readonly parent?: { readonly name: string };
  /**
   * Resolves the instance's main component — the dynamic-page-safe replacement
   * for the forbidden sync `mainComponent` getter. Null for detached instances.
   */
  readonly getMainComponentAsync?: () => Promise<AnyFigmaNode | null>;
}

/** Minimal write surface for fix application (`sandbox/fix-apply.ts`). */
export interface FixableNode {
  readonly setBoundVariable?: (field: string, variableId: string) => void;
  readonly fills?: readonly FigmaPaint[] | symbol;
  readonly strokes?: readonly FigmaPaint[] | symbol;
}

export function isFigmaVariableAlias(value: unknown): value is FigmaVariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as FigmaVariableAlias).type === 'VARIABLE_ALIAS' &&
    typeof (value as FigmaVariableAlias).id === 'string'
  );
}
