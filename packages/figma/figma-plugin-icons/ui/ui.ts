import {
  GENERATED_SUFFIX,
  parseUiMessage,
  type DetectedStrokeVariable,
  type InvalidReason,
  type PluginMessage,
} from '../src/messages.ts';
import { DEFAULT_STROKE_WEIGHTS, type StrokeConfig } from '../src/tokens.ts';

const REASON_LABELS: Record<InvalidReason, string> = {
  'not-a-component': 'La sélection doit être un Component ou ComponentSet',
  'already-generated': `Ce composant est déjà généré (contient ${GENERATED_SUFFIX})`,
  'no-24x24-variant': 'Le ComponentSet doit contenir un variant de 24×24px',
  'not-24x24': 'Le composant doit faire exactement 24×24px',
  'no-strokes': 'Le composant ne contient pas de strokes (lines/paths)',
  empty: 'Le composant est vide (aucun enfant à générer)',
};

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element #${id}`);
  }
  return element as T;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function sendToPlugin(message: PluginMessage): void {
  parent.postMessage({ pluginMessage: message }, '*');
}

function log(message: string): void {
  if (!__DEBUG__) {
    return;
  }
  console.log('[UI]', message);
  const debugConsole = document.getElementById('debug-console');
  if (debugConsole) {
    debugConsole.innerHTML += `${message}<br>`;
    debugConsole.scrollTop = debugConsole.scrollHeight;
    debugConsole.classList.add('visible');
  }
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

function showState(stateId: string): void {
  const states = document.querySelectorAll('.state');
  for (const state of states) {
    state.classList.remove('active');
  }
  document.getElementById(stateId)?.classList.add('active');
}

// ---------------------------------------------------------------------------
// Message handling (sandbox → UI)
// ---------------------------------------------------------------------------

window.onmessage = (event: MessageEvent) => {
  const raw = (event.data as { pluginMessage?: unknown } | null | undefined)?.pluginMessage;
  const message = parseUiMessage(raw);
  if (!message) {
    log('Received unknown message from plugin');
    return;
  }
  log(`Received message from plugin: ${message.type}`);

  switch (message.type) {
    case 'validation-result':
      showValidationResult(message.result);
      break;
    case 'validation-results':
      showValidationResults(message.summary);
      break;
    case 'progress':
      showProgress(message);
      break;
    case 'complete':
      showComplete(message.message);
      break;
    case 'error':
      showError(message.message);
      break;
    case 'stroke-config':
      fillStrokeInputs(message.config);
      break;
    case 'stroke-config-saved':
      if (message.success) {
        showState('state-initial');
      } else {
        showVariablesStatus('error', 'Échec de la sauvegarde de la configuration');
      }
      break;
    case 'stroke-config-reset':
      fillStrokeInputs(message.config);
      showVariablesStatus(
        message.success ? 'success' : 'error',
        message.success
          ? 'Configuration réinitialisée'
          : 'Échec de la réinitialisation de la configuration',
      );
      break;
    case 'stroke-variables-detected':
      handleVariablesDetected(message.variables);
      break;
    case 'stroke-variables-applied':
      if (message.success) {
        fillStrokeInputs(message.config);
        const strong = document.createElement('strong');
        strong.textContent = '✓ Variables appliquées avec succès';
        const fragment = document.createDocumentFragment();
        fragment.append(strong, document.createElement('br'), 'Les valeurs ont été mises à jour');
        showVariablesStatus('success', fragment);
      } else {
        showVariablesStatus(
          'error',
          'Échec de l’application des variables — la configuration n’a pas été sauvegardée',
        );
      }
      break;
    case 'stroke-variables-error':
      showVariablesStatus('error', message.message);
      break;
  }
};

// ---------------------------------------------------------------------------
// Validation rendering
// ---------------------------------------------------------------------------

function showValidationResult(result: {
  name: string;
  type: string;
  valid: boolean;
  reason: InvalidReason | null;
  currentSize?: string;
}): void {
  const list = requireElement('validation-list');
  const generateButton = requireElement<HTMLButtonElement>('btn-generate');
  showState('state-validation');

  const item = createElement('div', `validation-item ${result.valid ? 'success' : 'error'}`);
  item.appendChild(createElement('div', 'icon', result.valid ? '✓' : '✕'));
  const content = createElement('div', 'validation-content');
  if (result.valid) {
    content.appendChild(createElement('div', 'validation-label', result.name || 'Composant'));
    content.appendChild(
      createElement(
        'div',
        'validation-desc',
        `${result.type || 'Component'} • 24×24px • Contient des strokes`,
      ),
    );
  } else {
    content.appendChild(createElement('div', 'validation-label', 'Erreur de validation'));
    const reason = result.reason ?? 'not-a-component';
    const details = result.currentSize ? ` (actuel: ${result.currentSize})` : '';
    content.appendChild(
      createElement('div', 'validation-desc', `${REASON_LABELS[reason]}${details}`),
    );
  }
  item.appendChild(content);
  list.replaceChildren(item);

  if (result.valid) {
    generateButton.disabled = false;
    generateButton.textContent = 'Générer les icônes';
  } else {
    generateButton.disabled = true;
    generateButton.textContent = 'Corrigez la sélection';
  }
}

function showValidationResults(summary: {
  total: number;
  validCount: number;
  invalidCount: number;
  icons: readonly { name: string; type: string; valid: boolean; reason: InvalidReason | null }[];
}): void {
  const list = requireElement('validation-list');
  const generateButton = requireElement<HTMLButtonElement>('btn-generate');
  showState('state-validation');

  const header = createElement('div', 'multi-validation-header');
  const validLabel = document.createElement('strong');
  validLabel.textContent = `${summary.validCount} valides`;
  header.append(
    `${summary.total} icônes sélectionnées • `,
    validLabel,
    ` • ${summary.invalidCount} invalides`,
  );

  const rows = createElement('div', 'multi-validation-list');
  for (const [index, icon] of summary.icons.entries()) {
    const item = createElement('div', `multi-validation-item ${icon.valid ? 'success' : 'error'}`);
    item.appendChild(createElement('div', 'multi-validation-icon', icon.valid ? '✓' : '✕'));
    const content = createElement('div', 'multi-validation-content');
    content.appendChild(
      createElement('div', 'multi-validation-name', icon.name || `Icône ${index + 1}`),
    );
    if (icon.valid) {
      content.appendChild(
        createElement('span', 'multi-validation-type', `${icon.type || 'Component'} • 24×24px`),
      );
    } else {
      content.appendChild(
        createElement('span', 'multi-validation-error', reasonLabel(icon.reason)),
      );
    }
    item.appendChild(content);
    rows.appendChild(item);
  }

  list.replaceChildren(header, rows);

  if (summary.validCount > 0) {
    generateButton.disabled = false;
    const plural = summary.validCount > 1 ? 's' : '';
    generateButton.textContent = `Générer ${summary.validCount} icône${plural}`;
  } else {
    generateButton.disabled = true;
    generateButton.textContent = 'Aucune icône valide';
  }
}

function reasonLabel(reason: InvalidReason | null): string {
  return REASON_LABELS[reason ?? 'not-a-component'];
}

function showError(message: string): void {
  const item = createElement('div', 'validation-item error');
  item.appendChild(createElement('div', 'icon', '✕'));
  const content = createElement('div', 'validation-content');
  content.appendChild(createElement('div', 'validation-label', 'Erreur'));
  content.appendChild(createElement('div', 'validation-desc', message));
  item.appendChild(content);
  requireElement('validation-list').replaceChildren(item);
  showState('state-validation');
}

// ---------------------------------------------------------------------------
// Progress / completion rendering
// ---------------------------------------------------------------------------

function showProgress(message: { step: number; total: number; message: string }): void {
  showState('state-progress');
  const percent = Math.round((message.step / message.total) * 100);
  requireElement('progress-fill').style.width = `${percent}%`;
  requireElement('progress-text').textContent = `${percent}%`;
  requireElement('progress-status').textContent = message.message || 'En cours...';
}

function showComplete(message: string): void {
  showState('state-complete');
  const item = createElement('div', 'report-item');
  item.append(createElement('span', 'report-icon', '✓'), ` ${message}`);
  requireElement('report-content').replaceChildren(item);
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function fillStrokeInputs(config: StrokeConfig): void {
  for (const size of [16, 20, 24, 32, 40] as const) {
    requireElement<HTMLInputElement>(`stroke-${size}`).value = String(
      config[size] ?? DEFAULT_STROKE_WEIGHTS[size],
    );
  }
}

function readStrokeInputs(): StrokeConfig {
  const config = {} as StrokeConfig;
  for (const size of [16, 20, 24, 32, 40] as const) {
    const value = Number.parseFloat(requireElement<HTMLInputElement>(`stroke-${size}`).value);
    config[size] = Number.isFinite(value) ? value : DEFAULT_STROKE_WEIGHTS[size];
  }
  return config;
}

function showVariablesStatus(state: '' | 'success' | 'error', content: string | Node): void {
  const status = requireElement('variables-status');
  status.style.display = 'block';
  status.className = `variables-status${state ? ` ${state}` : ''}`;
  status.replaceChildren(content);
}

function handleVariablesDetected(variables: readonly DetectedStrokeVariable[]): void {
  const status = requireElement('variables-status');
  status.style.display = 'block';

  if (variables.length > 0) {
    status.className = 'variables-status';
    const label = document.createElement('strong');
    label.textContent = `${variables.length} variable(s) détectée(s)`;
    status.replaceChildren(label);
    for (const variable of variables) {
      status.appendChild(document.createElement('br'));
      status.append(`${variable.name} → Taille ${variable.size}`);
    }
    // Auto-apply the detected variables.
    sendToPlugin({ type: 'apply-stroke-variables', variables });
  } else {
    status.className = 'variables-status error';
    status.textContent = 'Aucune variable stroke trouvée dans les librairies';
  }
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

function analyze(): void {
  showState('state-loading');
  sendToPlugin({ type: 'validate' });
}

requireElement<HTMLButtonElement>('btn-analyze').onclick = analyze;
requireElement<HTMLButtonElement>('btn-regenerate').onclick = analyze;

requireElement<HTMLButtonElement>('btn-generate').onclick = () => {
  showState('state-progress');
  sendToPlugin({ type: 'generate' });
};

requireElement<HTMLButtonElement>('btn-cancel').onclick = () => {
  sendToPlugin({ type: 'cancel' });
};

requireElement<HTMLButtonElement>('btn-close').onclick = () => {
  sendToPlugin({ type: 'close' });
};

requireElement<HTMLButtonElement>('btn-restart').onclick = () => {
  showState('state-initial');
};

requireElement<HTMLButtonElement>('btn-settings').onclick = () => {
  showState('state-settings');
  sendToPlugin({ type: 'get-stroke-config' });
};

requireElement<HTMLButtonElement>('btn-settings-back').onclick = () => {
  showState('state-initial');
};

requireElement<HTMLButtonElement>('btn-save-config').onclick = () => {
  sendToPlugin({ type: 'save-stroke-config', config: readStrokeInputs() });
};

requireElement<HTMLButtonElement>('btn-reset-config').onclick = () => {
  showVariablesStatus('', 'Réinitialisation en cours...');
  sendToPlugin({ type: 'reset-stroke-config' });
};

requireElement<HTMLButtonElement>('btn-detect-variables').onclick = () => {
  showVariablesStatus('', 'Recherche des variables en cours...');
  sendToPlugin({ type: 'detect-stroke-variables' });
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

log('UI fully loaded and ready');
