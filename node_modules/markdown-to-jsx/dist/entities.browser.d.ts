/**
* Decode a single HTML entity reference using the browser's native HTML parser.
* Returns undefined if decoding fails or changes nothing (unknown entity).
*/
declare function decodeEntity(name: string): string | undefined;
/**
* Empty placeholder - browser uses DOM decoding for lookups
* This exists for API compatibility with the full entity table
*/
declare var NAMED_CODES_TO_UNICODE: Record<string, string>;
export { decodeEntity, NAMED_CODES_TO_UNICODE };
