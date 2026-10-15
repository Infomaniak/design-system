import type { TokenTier } from './token-tier.ts';

export interface VariableInfo {
  readonly id: string;
  readonly nameSegments: readonly string[];
  readonly collectionName: string;
  readonly tier: TokenTier;
  readonly scopes: readonly string[];
  /** False for variables local to the file, true for variables from a published library. */
  readonly remote: boolean;
  /**
   * The variable's own raw value (rgba color object, number, string, boolean)
   * when it is not an alias — the fix-mode suggestion engine matches raw
   * values exactly against unbound properties.
   */
  readonly value?: unknown;
  /** Present when the variable's value is an alias to another variable. */
  readonly aliasTargetId?: string;
}
