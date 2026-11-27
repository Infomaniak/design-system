import '@infomaniak-design-system/tokens/dist/web/css/tokens.root.css';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';
import 'playground-elements/playground-project.js';
import 'playground-elements/playground-tab-bar.js';
import { DEFAULT_PROJECT_FILES, type PlaygroundProjectManifest } from './default-template.ts';
import { decodeConfig, encodeConfig, SHARE_HASH_KEY } from './encode-config.ts';
import './theme.css';

/**
 * Base URL of the untrusted-code sandbox: the `playground-projects/` space of
 * the same playground-elements version as the bundled components (the default
 * would resolve relative to this bundle, i.e. our own origin — insecure).
 * Baked at build time from the installed package version (see
 * vite.playground.config.ts).
 */
declare const PLAYGROUND_SANDBOX_BASE_URL: string;

interface PlaygroundProjectElement extends HTMLElement {
  config: PlaygroundProjectManifest;
  modified: boolean;
  sandboxBaseUrl: string;
}

const HASH_DEBOUNCE_MS = 400;

const project = document.querySelector<PlaygroundProjectElement>('#project')!;
project.sandboxBaseUrl = PLAYGROUND_SANDBOX_BASE_URL;

const defaultConfig: PlaygroundProjectManifest = { files: structuredClone(DEFAULT_PROJECT_FILES) };

/* Live share URL: debounce the serialization of the current project state. */
let hashTimeout: number | undefined = undefined;
let latestEncode = 0;
project.addEventListener('compileDone', () => {
  window.clearTimeout(hashTimeout);
  hashTimeout = window.setTimeout(() => {
    const currentConfig = project.config;
    if (currentConfig === undefined || !project.modified) {
      return;
    }
    const request = ++latestEncode;
    void encodeConfig(currentConfig).then((payload) => {
      // Ignore stale encodings: a newer edit must win, whatever resolved first.
      if (payload !== undefined && request === latestEncode) {
        history.replaceState(null, '', `#${SHARE_HASH_KEY}=${payload}`);
      }
    });
  }, HASH_DEBOUNCE_MS);
});

/*
 * A hash pasted into the same tab applies the shared snippet. Our own
 * `replaceState` updates don't fire `hashchange`, so there is no loop.
 */
let latestDecode = 0;
const applyHash = async (): Promise<void> => {
  const request = ++latestDecode;
  const incomingConfig = await decodeConfig(location.hash);
  // Ignore stale decodes when several hash changes race.
  if (incomingConfig !== undefined && request === latestDecode) {
    project.config = incomingConfig;
  }
};
window.addEventListener('hashchange', () => {
  void applyHash();
});

const copyLinkButton = document.querySelector<HTMLButtonElement>('#copy-link')!;
copyLinkButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    copyLinkButton.textContent = 'Copied!';
  } catch (error) {
    console.error('Failed to copy the share link:', error);
    copyLinkButton.textContent = 'Copy failed';
  }
  window.setTimeout(() => {
    copyLinkButton.textContent = 'Copy link';
  }, 1500);
});

const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
resetButton.addEventListener('click', () => {
  project.config = structuredClone(defaultConfig);
  history.replaceState(null, '', location.pathname + location.search);
});

/* Initial load: apply the shared snippet when a hash is present. */
const initialConfig = await decodeConfig(location.hash);
project.config = structuredClone(initialConfig ?? defaultConfig);
