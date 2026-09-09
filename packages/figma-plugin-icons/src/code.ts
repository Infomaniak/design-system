import { describeError, generateIconSet, selectValidIcons } from './generation.ts';
import { parsePluginMessage } from './messages.ts';
import {
  loadStrokeConfig,
  resetStrokeConfig,
  saveStrokeConfig,
  type KeyValueStore,
} from './stroke-config.ts';
import { applyStrokeVariables, detectStrokeVariables } from './stroke-variables.ts';
import { DEFAULT_STROKE_WEIGHTS, type StrokeConfig } from './tokens.ts';
import { isComponentOrSet, validateSelection } from './validation.ts';

let strokeConfig: StrokeConfig = { ...DEFAULT_STROKE_WEIGHTS };

const clientStorage: KeyValueStore = {
  get: (key) => figma.clientStorage.getAsync(key),
  set: (key, value) => figma.clientStorage.setAsync(key, value),
};

async function initialize(): Promise<void> {
  strokeConfig = await loadStrokeConfig(clientStorage);
  log('Stroke config loaded, ready');
}

void initialize();

figma.showUI(__html__, { width: 400, height: 500 });
log('UI shown');

function handleValidate(): void {
  const selection = figma.currentPage.selection;
  log(`Validating ${selection.length} selected item(s)`);

  if (selection.length > 1) {
    const { icons, validCount } = validateSelection(selection);
    figma.ui.postMessage({
      type: 'validation-results',
      summary: {
        total: selection.length,
        validCount,
        invalidCount: selection.length - validCount,
        icons,
      },
    });
    return;
  }

  if (selection.length !== 1 || !isComponentOrSet(selection[0])) {
    figma.ui.postMessage({
      type: 'validation-result',
      result: { name: '', type: '', valid: false, reason: 'not-a-component' },
    });
    return;
  }

  figma.ui.postMessage({
    type: 'validation-result',
    result: validateSelection([selection[0]]).icons[0],
  });
}

async function handleGenerate(): Promise<void> {
  const selection = figma.currentPage.selection;
  const validIcons = selectValidIcons(selection);

  if (validIcons.length === 0) {
    figma.ui.postMessage({ type: 'error', message: 'Aucune icône valide sélectionnée' });
    return;
  }

  log(`Generating ${validIcons.length} icon(s)...`);

  try {
    for (const [index, icon] of validIcons.entries()) {
      await generateIconSet(icon, {
        index: index + 1,
        total: validIcons.length,
        strokeConfig,
        onProgress: (update) => figma.ui.postMessage({ type: 'progress', ...update }),
      });
      log(`Icon ${index + 1}/${validIcons.length} complete`);
    }
    figma.ui.postMessage({ type: 'complete', message: `${validIcons.length} icône(s) traitée(s)` });
  } catch (error) {
    log(`ERROR in handleGenerate: ${describeError(error)}`);
    figma.ui.postMessage({ type: 'error', message: `Erreur: ${describeError(error)}` });
  }
}

figma.ui.onmessage = (event: unknown) => {
  const message = parsePluginMessage(event);
  if (!message) {
    log('Received unknown message');
    return;
  }
  log(`Received message: ${message.type}`);

  switch (message.type) {
    case 'validate':
      handleValidate();
      break;
    case 'generate':
      void handleGenerate();
      break;
    case 'cancel':
      figma.closePlugin('Génération annulée');
      break;
    case 'close':
      figma.closePlugin();
      break;
    case 'get-stroke-config':
      figma.ui.postMessage({ type: 'stroke-config', config: strokeConfig });
      break;
    case 'save-stroke-config':
      void saveStrokeConfig(clientStorage, message.config).then((success) => {
        if (success) {
          strokeConfig = message.config;
        }
        figma.ui.postMessage({ type: 'stroke-config-saved', success });
      });
      break;
    case 'reset-stroke-config':
      void resetStrokeConfig(clientStorage).then((config) => {
        strokeConfig = config;
        figma.ui.postMessage({ type: 'stroke-config', config });
      });
      break;
    case 'detect-stroke-variables':
      void detectStrokeVariables().then((variables) => {
        figma.ui.postMessage({ type: 'stroke-variables-detected', variables });
      });
      break;
    case 'apply-stroke-variables':
      void applyStrokeVariables(message.variables, strokeConfig)
        .then((config) =>
          saveStrokeConfig(clientStorage, config).then((success) => ({ config, success })),
        )
        .then(({ config, success }) => {
          if (success) {
            strokeConfig = config;
          }
          figma.ui.postMessage({ type: 'stroke-variables-applied', success, config: strokeConfig });
        });
      break;
  }
};

function log(message: string): void {
  if (__DEBUG__) {
    console.log('[Icon Plugin]', message);
  }
}
