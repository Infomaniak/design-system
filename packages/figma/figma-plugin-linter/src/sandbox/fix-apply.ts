import type { FixSuggestion } from '../core/model/finding.ts';
import type { AnyFigmaNode, FigmaVariableAlias, FixableNode } from './figma-types.ts';

/**
 * Applies one fix suggestion to a node — the only place in the plugin that
 * mutates the document (the read-only contract ends here, fix mode Stage 5).
 *
 * - paint fixes reassign the fills/strokes array with the target paint's
 *   `boundVariables.color` set to the variable alias (precise per-paint
 *   targeting — `setBoundVariable('fills', …)` cannot pick a paint index)
 * - field fixes call `setBoundVariable(field, id)` per field; uniform padding
 *   and corner fixes expand to all four sides
 *
 * The caller preloads all nodes and runs the batch synchronously: mutations
 * without interleaved awaits coalesce into a single undo step.
 */
export function applyFixToNode(node: FixableNode, fix: FixSuggestion): void {
  if (node.setBoundVariable === undefined) {
    throw new Error('This Figma API surface does not support variable binding.');
  }

  switch (fix.kind) {
    case 'paint':
      bindPaint(node, fix);
      break;
    case 'field':
      for (const field of fix.fields ?? []) {
        node.setBoundVariable(field, fix.target);
      }
      break;
  }
}

function bindPaint(node: FixableNode, fix: FixSuggestion): void {
  const field: string = fix.fields?.[0] ?? 'fills';
  const paints: unknown = (node as unknown as Record<string, unknown>)[field];

  if (!Array.isArray(paints)) {
    throw new Error(`Layer has no ${field} to bind.`);
  }

  const index: number = fix.paintIndex ?? 0;
  const paint: unknown = paints[index];

  if (!isSolidPaint(paint)) {
    throw new Error(`No solid paint at index ${index} to bind.`);
  }

  const alias: FigmaVariableAlias = { type: 'VARIABLE_ALIAS', id: fix.target };
  const boundPaint: SolidPaint = {
    ...paint,
    boundVariables: { ...paint.boundVariables, color: alias },
  };

  const mutated: unknown[] = [...paints];
  mutated[index] = boundPaint;

  (node as unknown as Record<string, unknown>)[field] = mutated;
}

function isSolidPaint(paint: unknown): paint is SolidPaint {
  return (
    typeof paint === 'object' &&
    paint !== null &&
    (paint as SolidPaint).type === 'SOLID' &&
    typeof (paint as SolidPaint).color === 'object' &&
    typeof (paint as SolidPaint).color.r === 'number'
  );
}

/**
 * Downgrades the node fetched by id (the ambient API types it as the wide
 * `BaseNode` union) to the write surface fix application needs. The caller
 * knows the ids come from findings on lintable nodes.
 */
export function asFixable(
  node: AnyFigmaNode | { readonly id: string; readonly name: string },
): FixableNode {
  return node as unknown as FixableNode;
}
