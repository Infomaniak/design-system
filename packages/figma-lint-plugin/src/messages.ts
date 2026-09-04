import type { Finding } from './core/model/finding.ts';

/** Messages sent from the plugin iframe (UI) to the sandbox. */
export type UiToSandboxMessage =
  | { readonly type: 'lint-request' }
  | { readonly type: 'lint-cancel' }
  | { readonly type: 'select-finding'; readonly nodeId: string };

/** Messages sent from the sandbox to the plugin iframe (UI). */
export type SandboxToUiMessage =
  | { readonly type: 'lint-progress'; readonly completed: number; readonly total: number }
  | {
      readonly type: 'lint-result';
      readonly findings: readonly Finding[];
      readonly inspectedCount: number;
      readonly cancelled: boolean;
    }
  | { readonly type: 'lint-setup-error'; readonly message: string };
