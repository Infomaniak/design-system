import type { FixSuggestion } from './model/finding.ts';

/** One fix target: the node to mutate and the suggestion to apply. */
export interface FixRequestItem {
  readonly nodeId: string;
  readonly fix: FixSuggestion;
}

/**
 * Validates a `fix-request` payload (single or batch) before the sandbox glue
 * touches the Figma API — the iframe posts untyped messages, so the shapes are
 * only trusted after this check. Throws on the first invalid entry.
 */
export function parseFixRequestItems(input: unknown): readonly FixRequestItem[] {
  if (!Array.isArray(input)) {
    throw new Error('Invalid fix request: expected an array of items.');
  }

  return input.map((entry: unknown, index: number): FixRequestItem => {
    const prefix: string = `Invalid fix request at item ${index}: `;

    if (!isObject(entry)) {
      throw new Error(`${prefix}expected an object.`);
    }

    const { nodeId, fix } = entry as Record<string, unknown>;

    if (typeof nodeId !== 'string' || nodeId === '') {
      throw new Error(`${prefix}expected a non-empty nodeId string.`);
    }

    if (!isObject(fix)) {
      throw new Error(`${prefix}expected a fix object.`);
    }

    return { nodeId, fix: parseFixSuggestion(fix, prefix) };
  });
}

function parseFixSuggestion(fix: Record<string, unknown>, prefix: string): FixSuggestion {
  const { label, kind, target, fields, paintIndex } = fix;

  if (typeof label !== 'string' || label === '') {
    throw new Error(`${prefix}expected a non-empty fix label.`);
  }

  if (kind !== 'paint' && kind !== 'field') {
    throw new Error(`${prefix}expected fix kind "paint" or "field".`);
  }

  if (typeof target !== 'string' || target === '') {
    throw new Error(`${prefix}expected a non-empty fix target.`);
  }

  if (kind === 'field') {
    if (
      !Array.isArray(fields) ||
      fields.length === 0 ||
      !fields.every((field: unknown): boolean => typeof field === 'string' && field !== '')
    ) {
      throw new Error(`${prefix}expected non-empty fix fields.`);
    }

    return { label, kind, target, fields: [...fields] };
  }

  if (typeof paintIndex !== 'number' || !Number.isInteger(paintIndex) || paintIndex < 0) {
    throw new Error(`${prefix}expected a non-negative integer fix paintIndex.`);
  }

  return { label, kind, target, fields: parseFields(fields), paintIndex };
}

function parseFields(fields: unknown): readonly string[] | undefined {
  if (fields === undefined) {
    return undefined;
  }

  if (
    !Array.isArray(fields) ||
    !fields.every((field: unknown): boolean => typeof field === 'string')
  ) {
    throw new Error('Invalid fix request: expected string fields.');
  }

  return [...fields];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
