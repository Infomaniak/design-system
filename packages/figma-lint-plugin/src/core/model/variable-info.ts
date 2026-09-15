import type { TokenTier } from './token-tier.ts';

export interface VariableInfo {
  readonly id: string;
  readonly nameSegments: readonly string[];
  readonly collectionName: string;
  readonly tier: TokenTier;
  readonly scopes: readonly string[];
  /** Present when the variable's value is an alias to another variable. */
  readonly aliasTargetId?: string;
}
