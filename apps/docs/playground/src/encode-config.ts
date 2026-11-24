import type { PlaygroundProjectManifest } from './default-template.ts';

/**
 * Serialization of a project into a share-link hash payload.
 *
 * The payload is DEFLATE (raw) of the JSON, base64url-encoded behind a
 * version marker: `#code=z1.<base64url>`. The marker lets a future format
 * (e.g. `z2.`) coexist: decode only recognizes `z1.` and ignores anything
 * else.
 *
 * The Web Compression streams are assumed: without `CompressionStream` the
 * payload cannot be built (encode yields `undefined`), without
 * `DecompressionStream` it cannot be read (decode yields `undefined`).
 */

/** Key of the location-hash parameter carrying the share payload. */
export const SHARE_HASH_KEY = 'code';

/** Version marker of the current payload format. */
const FORMAT_PREFIX = 'z1.';
/** Matches only the current format's payloads; anything else is ignored. */
const HASH_PAYLOAD_PATTERN = new RegExp(
  `#${SHARE_HASH_KEY}=${FORMAT_PREFIX.replaceAll('.', '\\.')}([A-Za-z0-9_-]+)`,
);

let hasWarnedAboutMissingStreams = false;

function warnAboutMissingStreamsOnce(): void {
  if (hasWarnedAboutMissingStreams) {
    return;
  }
  hasWarnedAboutMissingStreams = true;
  console.warn('Playground: share links need CompressionStream support (browsers from 2023 on).');
}

/**
 * Serialize the project for a share link: only the editable essentials
 * (`content`, `selected`). Playground-inferred `contentType`s (e.g. its
 * `video/mp2t` guess for `.ts` files) and labels are dropped — they are
 * re-inferred on load and would bloat the URL.
 */
export function serializeConfig(config: PlaygroundProjectManifest): PlaygroundProjectManifest {
  return {
    files: Object.fromEntries(
      Object.entries(config.files ?? {}).map(([name, file]) => [
        name,
        file.selected === true
          ? { content: file.content, selected: true }
          : { content: file.content },
      ]),
    ),
  };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function base64UrlToBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  let base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
  base64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

async function pipeThrough(
  bytes: Uint8Array<ArrayBuffer>,
  stream: TransformStream,
): Promise<Uint8Array> {
  const piped = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(piped).arrayBuffer());
}

function parseConfig(json: string): PlaygroundProjectManifest | undefined {
  try {
    const config: unknown = JSON.parse(json);
    if (typeof config !== 'object' || config === null) {
      return undefined;
    }
    const files: unknown = (config as PlaygroundProjectManifest).files;
    if (typeof files !== 'object' || files === null || Array.isArray(files)) {
      return undefined;
    }
    return config as PlaygroundProjectManifest;
  } catch {
    return undefined;
  }
}

/**
 * Encodes the project for a share link, or `undefined` when the payload
 * cannot be built (no `CompressionStream`, or a compression failure).
 */
export async function encodeConfig(config: PlaygroundProjectManifest): Promise<string | undefined> {
  if (typeof CompressionStream === 'undefined') {
    warnAboutMissingStreamsOnce();
    return undefined;
  }
  const json = JSON.stringify(serializeConfig(config));
  const bytes = new TextEncoder().encode(json);
  try {
    const compressed = await pipeThrough(bytes, new CompressionStream('deflate-raw'));
    return `${FORMAT_PREFIX}${bytesToBase64Url(compressed)}`;
  } catch {
    return undefined;
  }
}

/**
 * Decodes the `#code=` payload of a location hash, or `undefined` when the
 * payload is absent, from another format version, or undecodable.
 */
export async function decodeConfig(hash: string): Promise<PlaygroundProjectManifest | undefined> {
  const match = hash.match(HASH_PAYLOAD_PATTERN);
  if (match === null || typeof DecompressionStream === 'undefined') {
    return undefined;
  }
  try {
    const decompressed = await pipeThrough(
      base64UrlToBytes(match[1]),
      new DecompressionStream('deflate-raw'),
    );
    return parseConfig(new TextDecoder().decode(decompressed));
  } catch {
    return undefined;
  }
}
