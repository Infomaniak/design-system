import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROJECT_FILES, type PlaygroundProjectManifest } from './default-template.ts';
import { decodeConfig, encodeConfig, serializeConfig } from './encode-config.ts';

const DEFAULT_CONFIG: PlaygroundProjectManifest = { files: structuredClone(DEFAULT_PROJECT_FILES) };

const CONFIG: PlaygroundProjectManifest = {
  files: {
    'index.html': { content: '<body>Hello</body>', selected: true },
    'script.ts': { content: 'console.log(1);' },
  },
};

function plainBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

async function deflate(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const deflated = new Uint8Array(
    await new Response(
      new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw')),
    ).arrayBuffer(),
  );
  return btoa(String.fromCharCode(...deflated))
    .replaceAll('+', '-')
    .replaceAll('/', '_');
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('serializeConfig', () => {
  it('should keep only the content and the selected flag', () => {
    expect(
      serializeConfig({
        files: {
          'index.html': {
            content: '<body></body>',
            selected: true,
            label: 'HTML',
            contentType: 'text/html',
            hidden: false,
          },
          'script.ts': { content: 'x();' },
        } as PlaygroundProjectManifest['files'],
      }),
    ).toEqual({
      files: {
        'index.html': { content: '<body></body>', selected: true },
        'script.ts': { content: 'x();' },
      },
    });
  });

  it('should tolerate a missing files map', () => {
    expect(serializeConfig({} as PlaygroundProjectManifest)).toEqual({ files: {} });
  });
});

describe('encodeConfig', () => {
  it('should encode the project behind the z1 version marker', async () => {
    const encoded = await encodeConfig(CONFIG);
    expect(encoded?.startsWith('z1.')).toBe(true);
  });

  it('should compress the default template', async () => {
    const encoded = await encodeConfig(DEFAULT_CONFIG);
    const json = JSON.stringify(serializeConfig(DEFAULT_CONFIG));
    expect(encoded?.length).toBeLessThan(json.length);
  });

  it('should return undefined when the compression stream is unavailable, warning once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('CompressionStream', undefined);

    expect(await encodeConfig(CONFIG)).toBeUndefined();
    expect(await encodeConfig(CONFIG)).toBeUndefined();

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('should return undefined when compression fails', async () => {
    vi.stubGlobal(
      'CompressionStream',
      class {
        constructor() {
          throw new Error('boom');
        }
      },
    );
    expect(await encodeConfig(CONFIG)).toBeUndefined();
  });
});

describe('decodeConfig', () => {
  it('should round-trip a project', async () => {
    const encoded = await encodeConfig(CONFIG);
    expect(await decodeConfig(`#code=${encoded}`)).toEqual(serializeConfig(CONFIG));
  });

  it('should round-trip the default template', async () => {
    const encoded = await encodeConfig(DEFAULT_CONFIG);
    expect(await decodeConfig(`#code=${encoded}`)).toEqual(serializeConfig(DEFAULT_CONFIG));
  });

  it('should read the payload from a full URL hash', async () => {
    const encoded = await encodeConfig(CONFIG);
    expect(
      await decodeConfig(`https://example.com/playground/index.html?x=1#code=${encoded}`),
    ).toEqual(serializeConfig(CONFIG));
  });

  it('should return undefined without a hash payload', async () => {
    expect(await decodeConfig('')).toBeUndefined();
    expect(await decodeConfig('#other=1')).toBeUndefined();
    expect(await decodeConfig('https://example.com/playground/index.html')).toBeUndefined();
  });

  it('should ignore payloads from another format version', async () => {
    // Plain base64url of the JSON — the pre-compression format.
    const legacy = plainBase64Url(JSON.stringify(serializeConfig(CONFIG)));
    expect(await decodeConfig(`#code=${legacy}`)).toBeUndefined();

    // A hypothetical future format.
    expect(
      await decodeConfig(`#code=z2.${await deflate(JSON.stringify(serializeConfig(CONFIG)))}`),
    ).toBeUndefined();
  });

  it('should return undefined for malformed payloads', async () => {
    expect(await decodeConfig('#code=z1.')).toBeUndefined();
    expect(await decodeConfig('#code=z1.abc')).toBeUndefined();
    expect(await decodeConfig(`#code=z1.${await deflate('not json')}`)).toBeUndefined();
    expect(await decodeConfig(`#code=z1.${await deflate('null')}`)).toBeUndefined();
    expect(await decodeConfig(`#code=z1.${await deflate('{"files":"nope"}')}`)).toBeUndefined();
    expect(await decodeConfig(`#code=z1.${await deflate('{"files":[]}')}`)).toBeUndefined();
  });

  it('should return undefined when the decompression stream is unavailable', async () => {
    vi.stubGlobal('DecompressionStream', undefined);
    expect(await decodeConfig(`#code=${await encodeConfig(CONFIG)}`)).toBeUndefined();
  });
});
