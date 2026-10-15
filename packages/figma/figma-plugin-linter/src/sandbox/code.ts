import { createLintContext } from '../core/context.ts';
import { collectBoundVariableIds } from '../core/engine/collect-bound-variable-ids.ts';
import { collectEffectStyleIds } from '../core/engine/collect-effect-style-ids.ts';
import { collectTextStyleIds } from '../core/engine/collect-text-style-ids.ts';
import { lintTree } from '../core/engine/lint.ts';
import { parseFixRequestItems, type FixRequestItem } from '../core/fix-request.ts';
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
import type { FixFailure, SandboxToUiMessage, UiToSandboxMessage } from '../messages.ts';
import { loadEffectStyleMetadata } from './effect-style-metadata.ts';
import type { AnyFigmaNode } from './figma-types.ts';
import { applyFixToNode, asFixable } from './fix-apply.ts';
import { collectInstanceIdentities, type InstanceIdentity } from './instance-identities.ts';
import { toLintNode } from './node-adapter.ts';
import { loadTextStyleMetadata } from './text-style-metadata.ts';
import { loadTokenMetadata } from './token-metadata.ts';

/**
 * Sandbox entry point (glue — not unit tested). Wires the Figma runtime to the
 * engine: reads the scan roots for the requested scope (selection, current
 * page or the whole file), resolves token metadata (local variables in bulk,
 * bound ids on demand — e.g. tokens bound from a published library) and
 * effect/text style metadata (local styles in bulk, referenced ids on demand),
 * runs the lint and posts progress/results to the panel.
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
    case 'fix-request':
      void applyFixes(uiMessage.items);
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

  const effectStyleIds: readonly string[] = collectEffectStyleIds(nodes);
  debug('effect style ids', `${effectStyleIds.length} collected`);

  const effectStylesById = await loadEffectStyleMetadata(figma, effectStyleIds);

  debug('effect style metadata loaded', `${effectStylesById.size} styles`);

  const textStyleIds: readonly string[] = collectTextStyleIds(nodes);
  debug('text style ids', `${textStyleIds.length} collected`);

  const textStylesById = await loadTextStyleMetadata(figma, textStyleIds);

  debug('text style metadata loaded', `${textStylesById.size} styles`);

  const result = await lintTree(nodes, {
    rules: LINT_RULES,
    context: createLintContext(variablesById, effectStylesById, textStylesById),
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
 * Applies fix suggestions (fix mode — the read-only contract ends here).
 *
 * All nodes are preloaded BEFORE any mutation and the mutations then run
 * synchronously in one turn: Figma coalesces mutations without interleaved
 * awaits into a single undo step, so a whole batch reverts with one ⌘Z.
 * Payloads are validated in core first; invalid payloads report every item
 * failed instead of throwing at the API surface.
 */
async function applyFixes(items: readonly FixRequestItem[]): Promise<void> {
  const applied: string[] = [];
  const failed: FixFailure[] = [];

  let validated: readonly FixRequestItem[];

  try {
    validated = parseFixRequestItems(items);
  } catch (error: unknown) {
    debug('fix-request rejected', error instanceof Error ? error.message : String(error));
    post({ type: 'fix-result', applied, failed: toFailures(items, 'Invalid fix request.') });
    return;
  }

  const nodeIds: readonly string[] = [
    ...new Set(validated.map((item: FixRequestItem): string => item.nodeId)),
  ];
  const nodes: readonly ({ readonly id: string; readonly name: string } | null)[] =
    await Promise.all(
      nodeIds.map(
        async (nodeId: string): Promise<{ readonly id: string; readonly name: string } | null> =>
          figma.getNodeByIdAsync(nodeId),
      ),
    );
  const nodesById: ReadonlyMap<string, { readonly id: string; readonly name: string } | null> =
    new Map(
      nodeIds.map(
        (
          nodeId: string,
          index: number,
        ): readonly [string, { readonly id: string; readonly name: string } | null] => [
          nodeId,
          nodes[index] ?? null,
        ],
      ),
    );

  for (const item of validated) {
    const node = nodesById.get(item.nodeId);

    if (node === undefined || node === null) {
      failed.push({ nodeId: item.nodeId, reason: 'Layer not found — removed or out of scope.' });
      continue;
    }

    try {
      applyFixToNode(asFixable(node), item.fix);
      applied.push(item.nodeId);
    } catch (error: unknown) {
      const reason: string = error instanceof Error ? error.message : String(error);
      debug('fix failed', `${item.fix.label} on ${item.nodeId} — ${reason}`);
      failed.push({ nodeId: item.nodeId, reason });
    }
  }

  debug('fixes applied', `${applied.length} ok, ${failed.length} failed`);

  post({ type: 'fix-result', applied, failed });
}

function toFailures(
  items: readonly FixRequestItem[] | readonly unknown[],
  reason: string,
): readonly FixFailure[] {
  return (items as readonly FixRequestItem[])
    .filter((item: FixRequestItem): boolean => typeof item?.nodeId === 'string')
    .map((item: FixRequestItem): FixFailure => ({ nodeId: item.nodeId, reason }));
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
