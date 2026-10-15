import type { FixRequestItem } from './core/fix-request.ts';
import type { Finding } from './core/model/finding.ts';
import type { ScanScope } from './core/scan-scope.ts';

/** Messages sent from the plugin iframe (UI) to the sandbox. */
export type UiToSandboxMessage =
  | { readonly type: 'lint-request'; readonly scope: ScanScope }
  | { readonly type: 'lint-cancel' }
  | { readonly type: 'select-finding'; readonly nodeId: string }
  | { readonly type: 'fix-request'; readonly items: readonly FixRequestItem[] };

/** A node whose fix could not be applied, with the reason. */
export interface FixFailure {
  readonly nodeId: string;
  readonly reason: string;
}

/** Messages sent from the sandbox to the plugin iframe (UI). */
export type SandboxToUiMessage =
  | { readonly type: 'lint-progress'; readonly completed: number; readonly total: number }
  | {
      readonly type: 'lint-result';
      readonly findings: readonly Finding[];
      readonly inspectedCount: number;
      readonly cancelled: boolean;
    }
  | { readonly type: 'lint-setup-error'; readonly message: string }
  | {
      readonly type: 'fix-result';
      readonly applied: readonly string[];
      readonly failed: readonly FixFailure[];
    };
