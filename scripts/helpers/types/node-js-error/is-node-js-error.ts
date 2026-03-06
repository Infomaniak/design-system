import type { NodeJsError } from './node-js-error.ts';

export function isNodeJsError(input: unknown): input is NodeJsError {
  return Error.isError(input) && typeof (input as { code?: unknown }).code === 'string';
}
