import { createLintContext } from '../core/context.ts';
import { collectBoundVariableIds } from '../core/engine/collect-bound-variable-ids.ts';
import { lintTree } from '../core/engine/lint.ts';
import type { LintNode } from '../core/model/lint-node.ts';
import type { VariableInfo } from '../core/model/variable-info.ts';
import { LINT_RULES } from '../core/rules/registry.ts';
import {
  parseScanScope,
  requiresSelection,
  scanRootsFor,
  type ScanRootsDescriptor,
  type ScanScope,
} from '../core/scan-scope.ts';
import type { SandboxToUiMessage, UiToSandboxMessage } from '../messages.ts';
import type { AnyFigmaNode } from './figma-types.ts';
import { collectInstanceIdentities, type InstanceIdentity } from './instance-identities.ts';
import { toLintNode } from './node-adapter.ts';
import { loadTokenMetadata } from './token-metadata.ts';

/**
 * Sandbox entry point (glue — not unit tested). Wires the Figma runtime to the
 * engine: reads the scan roots for the requested scope (selection, current
 * page or the whole file), resolves token metadata (local variables in bulk,
 * bound ids on demand — e.g. tokens bound from a published library), runs the
 * lint and posts progress/results to the panel.
 */
// `figma` is the ambient PluginAPI global from @figma/plugin-typings (see figma-env.d.ts).
declare const __html__: string;

const NO_SELECTION_MESSAGE: string = 'Select at least one layer to lint.';
const LINT_FAILED_MESSAGE: string = 'Lint failed — try again (see the developer console).';
const DEBUG_PREFIX: string = '[design-linter]';

let cancelRequested: boolean = false;

function debug(label: string, detail: string = ''): void {
  console.info(`${DEBUG_PREFIX} ${label}${detail === '' ? '' : ` — ${detail}`}`);
}

figma.showUI(__html__, { width: 320, height: 420, themeColors: true });

figma.ui.onmessage = (message: unknown): void => {
  const uiMessage: UiToSandboxMessage = message as UiToSandboxMessage;

  switch (uiMessage.type) {
    case 'lint-request':
      void runLint(parseScanScope(uiMessage.scope)).catch((error: unknown): void => {
        console.error(`${DEBUG_PREFIX} Lint run failed:`, error);
        post({ type: 'lint-setup-error', message: LINT_FAILED_MESSAGE });
      });
      break;
    case 'lint-cancel':
      cancelRequested = true;
      break;
    case 'select-finding':
      void selectFinding(uiMessage.nodeId);
      break;
  }
};

async function runLint(scope: ScanScope): Promise<void> {
  cancelRequested = false;

  const roots: readonly AnyFigmaNode[] = collectScanRoots(scanRootsFor(scope));

  debug(
    'scan roots',
    `${roots.length} nodes (scope: ${scope}; types: ${roots.map((root: AnyFigmaNode): string => root.type).join(', ') || 'none'})`,
  );

  if (requiresSelection(scope) && roots.length === 0) {
    post({ type: 'lint-setup-error', message: NO_SELECTION_MESSAGE });
    return;
  }

  const instanceIdentities: ReadonlyMap<string, InstanceIdentity> =
    await collectInstanceIdentities(roots);

  debug('instance identities resolved', `${instanceIdentities.size} resolved`);

  const nodes: readonly LintNode[] = roots.map((node: AnyFigmaNode): LintNode =>
    toLintNode(node, { instanceIdentities }),
  );

  debug('node tree adapted', `${nodes.length} roots`);

  const variableIds: readonly string[] = collectBoundVariableIds(nodes);
  debug('bound variable ids', `${variableIds.length} collected`);

  const variablesById: ReadonlyMap<string, VariableInfo> = await loadTokenMetadata(
    figma.variables,
    variableIds,
    (): TeamLibraryAPI | undefined => figma.teamLibrary,
    debug,
  );

  debug('token metadata loaded', `${variablesById.size} variables`);

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

  debug(
    'lint done',
    `${result.findings.length} findings, ${result.inspectedCount} inspected, cancelled=${String(result.cancelled)}`,
  );

  post({
    type: 'lint-result',
    findings: result.findings,
    inspectedCount: result.inspectedCount,
    cancelled: result.cancelled,
  });
}

async function selectFinding(nodeId: string): Promise<void> {
  const node = await figma.getNodeByIdAsync(nodeId);

  if (node === null || node.type === 'PAGE') {
    return;
  }

  figma.currentPage.selection = [node as SceneNode];
  figma.viewport.scrollAndZoomIntoView([node]);
}

/**
 * Maps a root descriptor to its Figma API call — the only place that knows
 * where the nodes come from. Pages are not lintable; their children are the
 * scan roots for the page and file scopes.
 */
function collectScanRoots(descriptor: ScanRootsDescriptor): readonly AnyFigmaNode[] {
  switch (descriptor) {
    case 'selection':
      return figma.currentPage.selection as readonly AnyFigmaNode[];
    case 'page-children':
      return figma.currentPage.children as readonly AnyFigmaNode[];
    case 'all-pages-children':
      return (figma.root.children as readonly AnyFigmaNode[]).flatMap(
        (page: AnyFigmaNode): readonly AnyFigmaNode[] => page.children ?? [],
      );
  }
}

function post(message: SandboxToUiMessage): void {
  figma.ui.postMessage(message);
}
