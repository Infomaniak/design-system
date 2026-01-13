import type { CurlyReference } from './types/curly/curly-reference.ts';
import type { JsonReference } from './types/json/json-reference.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#reference-syntax
 */
export type DesignTokenReference = CurlyReference | JsonReference;
