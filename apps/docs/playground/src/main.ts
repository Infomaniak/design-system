import '@infomaniak-design-system/tokens/dist/web/css/tokens.root.css';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';
import 'playground-elements/playground-project.js';
import 'playground-elements/playground-tab-bar.js';
import { DEFAULT_PROJECT_FILES, type PlaygroundProjectManifest } from './default-template.ts';
import './theme.css';

/**
 * Base URL of the untrusted-code sandbox: the `playground-projects/` space of
 * the same playground-elements version as the bundled components (the default
 * would resolve relative to this bundle, i.e. our own origin — insecure).
 * Baked at build time from the installed package version (see
 * vite.playground.config.ts).
 */
declare const PLAYGROUND_SANDBOX_BASE_URL: string;

/** Remote Infomaniak Sans stylesheet, baked at build time (same env as Storybook). */
declare const PLAYGROUND_FONTS_CSS_URL: string;

/** Load Infomaniak Sans for the page chrome. */
const fontsLink = document.createElement('link');
fontsLink.rel = 'stylesheet';
fontsLink.href = PLAYGROUND_FONTS_CSS_URL;
document.head.append(fontsLink);

interface PlaygroundProjectElement extends HTMLElement {
  config: PlaygroundProjectManifest;
  modified: boolean;
}

const HASH_KEY = 'code';
const HASH_DEBOUNCE_MS = 400;

/**
 * Serialize the project for a share link: only the editable essentials
 * (`content`, `selected`). Playground-inferred `contentType`s (e.g. its
 * `video/mp2t` guess for `.ts` files) and labels are dropped — they are
 * re-inferred on load and would bloat the URL.
 */
function serializeConfig(config: PlaygroundProjectManifest): PlaygroundProjectManifest {
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

function encodeConfig(config: PlaygroundProjectManifest): string {
  const bytes = new TextEncoder().encode(JSON.stringify(serializeConfig(config)));
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function decodeConfig(hash: string): PlaygroundProjectManifest | undefined {
  const match = hash.match(new RegExp(`#${HASH_KEY}=([A-Za-z0-9_-]+)`));
  if (match === null) {
    return undefined;
  }
  let base64 = match[1].replaceAll('-', '+').replaceAll('_', '/');
  base64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  try {
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const config: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (
      typeof config !== 'object' ||
      config === null ||
      typeof (config as PlaygroundProjectManifest).files !== 'object'
    ) {
      return undefined;
    }
    return config as PlaygroundProjectManifest;
  } catch {
    return undefined;
  }
}

const project = document.querySelector<PlaygroundProjectElement>('#project')!;
project.sandboxBaseUrl = PLAYGROUND_SANDBOX_BASE_URL;

const defaultConfig: PlaygroundProjectManifest = { files: structuredClone(DEFAULT_PROJECT_FILES) };
const initialConfig: PlaygroundProjectManifest = decodeConfig(location.hash) ?? defaultConfig;
project.config = structuredClone(initialConfig);

/* Live share URL: debounce the serialization of the current project state. */
let hashTimeout: number | undefined = undefined;
project.addEventListener('compileDone', () => {
  window.clearTimeout(hashTimeout);
  hashTimeout = window.setTimeout(() => {
    const currentConfig = project.config;
    if (currentConfig === undefined || !project.modified) {
      return;
    }
    history.replaceState(null, '', `#${HASH_KEY}=${encodeConfig(currentConfig)}`);
  }, HASH_DEBOUNCE_MS);
});

/*
 * A hash pasted into the same tab applies the shared snippet. Our own
 * `replaceState` updates don't fire `hashchange`, so there is no loop.
 */
window.addEventListener('hashchange', () => {
  const incomingConfig = decodeConfig(location.hash);
  if (incomingConfig !== undefined) {
    project.config = incomingConfig;
  }
});

const copyLinkButton = document.querySelector<HTMLButtonElement>('#copy-link')!;
copyLinkButton.addEventListener('click', async () => {
  await navigator.clipboard.writeText(location.href);
  copyLinkButton.textContent = 'Copied!';
  window.setTimeout(() => {
    copyLinkButton.textContent = 'Copy link';
  }, 1500);
});

const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
resetButton.addEventListener('click', () => {
  project.config = structuredClone(defaultConfig);
  history.replaceState(null, '', location.pathname + location.search);
});
