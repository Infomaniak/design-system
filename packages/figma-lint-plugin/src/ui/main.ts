import type { Finding } from '../core/model/finding.ts';
import { findingsToMarkdown } from '../core/report/markdown.ts';
import { summarizeFindings } from '../core/report/summarize.ts';
import type { SandboxToUiMessage, UiToSandboxMessage } from '../messages.ts';
import { copyTextToClipboard } from './clipboard.ts';
import { renderPanel, type LintPanelState } from './ui.ts';

/**
 * Iframe entry point (glue — not unit tested). Wires DOM events and sandbox
 * messages to the pure panel renderer.
 */
const rootElement: HTMLElement | null = document.querySelector<HTMLElement>('#app');

if (rootElement === null) {
  throw new Error('Missing #app root element.');
}

const root: HTMLElement = rootElement;

const MIN_RUNNING_MS: number = 350;

let latestFindings: readonly Finding[] = [];
let latestState: LintPanelState = { kind: 'idle' };
let runStartedAt: number = 0;

function update(state: LintPanelState): void {
  latestState = state;
  renderPanel(state, root);
}

function post(message: UiToSandboxMessage): void {
  window.parent.postMessage({ pluginMessage: message }, '*');
}

root.addEventListener('click', (event: MouseEvent): void => {
  const target: HTMLElement | null =
    (event.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-action], [data-finding-index]',
    ) ?? null;

  if (target === null) {
    return;
  }

  const findingIndex: string | undefined = target.dataset['findingIndex'];

  if (findingIndex !== undefined) {
    const finding: Finding | undefined = latestFindings[Number(findingIndex)];

    if (finding !== undefined) {
      post({ type: 'select-finding', nodeId: finding.nodeId });
    }

    return;
  }

  switch (target.dataset['action']) {
    case 'run':
      update({ kind: 'running', completed: 0, total: 0 });
      runStartedAt = Date.now();
      post({ type: 'lint-request' });
      break;
    case 'cancel':
      post({ type: 'lint-cancel' });
      break;
    case 'copy-report':
      void copyReport();
      break;
  }
});

async function copyReport(): Promise<void> {
  const state: LintPanelState = latestState;

  if (state.kind !== 'results') {
    return;
  }

  try {
    await copyTextToClipboard(
      findingsToMarkdown(latestFindings, {
        inspectedCount: state.inspectedCount,
        cancelled: state.cancelled,
      }),
    );
    update({ ...state, feedback: 'copied', refreshed: false });
  } catch {
    update({ ...state, feedback: 'copy-failed', refreshed: false });
  }
}

window.onmessage = (event: MessageEvent): void => {
  const message: SandboxToUiMessage | undefined = (
    event.data as { pluginMessage?: SandboxToUiMessage } | undefined
  )?.pluginMessage;

  if (message === undefined) {
    return;
  }

  switch (message.type) {
    case 'lint-progress':
      update({ kind: 'running', completed: message.completed, total: message.total });
      break;
    case 'lint-result':
      applyRunResult((): void => {
        const summary = summarizeFindings(message.findings);
        latestFindings = [...summary.errors, ...summary.warnings];

        if (summary.errorCount === 0 && summary.warningCount === 0 && !message.cancelled) {
          update({ kind: 'clean', inspectedCount: message.inspectedCount, refreshed: true });
        } else {
          update({
            kind: 'results',
            summary,
            inspectedCount: message.inspectedCount,
            cancelled: message.cancelled,
            refreshed: true,
          });
        }
      });
      break;
    case 'lint-setup-error':
      applyRunResult((): void => {
        update({ kind: 'setup-error', message: message.message });
      });
      break;
  }
};

function applyRunResult(apply: () => void): void {
  const remainingMs: number = MIN_RUNNING_MS - (Date.now() - runStartedAt);

  if (remainingMs <= 0 || latestState.kind !== 'running') {
    apply();
    return;
  }

  setTimeout((): void => {
    if (latestState.kind === 'running') {
      apply();
    }
  }, remainingMs);
}

update({ kind: 'idle' });
