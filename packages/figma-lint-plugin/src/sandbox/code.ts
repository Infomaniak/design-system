import { createLintContext } from '../core/context.ts';
import { collectBoundVariableIds } from '../core/engine/collect-bound-variable-ids.ts';
import { lintTree } from '../core/engine/lint.ts';
import type { LintNode } from '../core/model/lint-node.ts';
import type { VariableInfo } from '../core/model/variable-info.ts';
import { LINT_RULES } from '../core/rules/registry.ts';
import type { SandboxToUiMessage, UiToSandboxMessage } from '../messages.ts';
import type { FigmaNode, FigmaSandboxApi } from './figma-types.ts';
import { toLintNode } from './node-adapter.ts';
import { loadTokenMetadata } from './token-metadata.ts';

/**
 * Sandbox entry point (glue — not unit tested). Wires the Figma runtime to the
 * engine: reads the selection, resolves token metadata (local variables in bulk,
 * bound ids on demand — e.g. tokens bound from a published library), runs the
 * lint and posts progress/results to the panel.
 */
declare const figma: FigmaSandboxApi;
declare const __html__: string;

const NO_SELECTION_MESSAGE: string = 'Select at least one layer to lint.';

let cancelRequested: boolean = false;

figma.showUI(__html__, { width: 320, height: 420, themeColors: true });

figma.ui.onmessage = (message: unknown): void => {
  const uiMessage: UiToSandboxMessage = message as UiToSandboxMessage;

  switch (uiMessage.type) {
    case 'lint-request':
      void runLint();
      break;
    case 'lint-cancel':
      cancelRequested = true;
      break;
    case 'select-finding':
      void selectFinding(uiMessage.nodeId);
      break;
  }
};

async function runLint(): Promise<void> {
  cancelRequested = false;

  const selection: readonly FigmaNode[] = figma.currentPage.selection as readonly FigmaNode[];

  if (selection.length === 0) {
    post({ type: 'lint-setup-error', message: NO_SELECTION_MESSAGE });
    return;
  }

  const nodes: readonly LintNode[] = selection.map((node: FigmaNode): LintNode => toLintNode(node));

  const variablesById: ReadonlyMap<string, VariableInfo> = await loadTokenMetadata(
    figma.variables,
    collectBoundVariableIds(nodes),
  );

  const result = await lintTree(nodes, {
    rules: LINT_RULES,
    context: createLintContext(variablesById),
    onProgress: (completed: number, total: number): void => {
      post({ type: 'lint-progress', completed, total });
    },
    shouldContinue: (): boolean => !cancelRequested,
    yieldNow: (): Promise<void> =>
      new Promise((resolve: () => void): void => {
        setTimeout(resolve, 0);
      }),
  });

  post({
    type: 'lint-result',
    findings: result.findings,
    inspectedCount: result.inspectedCount,
    cancelled: result.cancelled,
  });
}

async function selectFinding(nodeId: string): Promise<void> {
  const node: { readonly id: string; readonly name: string } | null =
    await figma.getNodeByIdAsync(nodeId);

  if (node === null) {
    return;
  }

  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
}

function post(message: SandboxToUiMessage): void {
  figma.ui.postMessage(message);
}
