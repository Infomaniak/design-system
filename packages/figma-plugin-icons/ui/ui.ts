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
};

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element #${id}`);
  }
  return element as T;
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
    case 'stroke-variables-detected':
      handleVariablesDetected(message.variables);
      break;
    case 'stroke-variables-applied':
      if (message.success) {
        fillStrokeInputs(message.config);
        showVariablesStatus(
          'success',
          '<strong>✓ Variables appliquées avec succès</strong><br>Les valeurs ont été mises à jour',
        );
      }
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

  if (result.valid) {
    list.innerHTML =
      '<div class="validation-item success">' +
      '<div class="icon">✓</div>' +
      '<div class="validation-content">' +
      `<div class="validation-label">${escapeHtml(result.name) || 'Composant'}</div>` +
      `<div class="validation-desc">${escapeHtml(result.type) || 'Component'} • 24×24px • Contient des strokes</div>` +
      '</div>' +
      '</div>';
    generateButton.disabled = false;
    generateButton.textContent = 'Générer les icônes';
    return;
  }

  const reason = result.reason ?? 'not-a-component';
  const details = result.currentSize ? ` (actuel: ${result.currentSize})` : '';
  list.innerHTML =
    '<div class="validation-item error">' +
    '<div class="icon">✕</div>' +
    '<div class="validation-content">' +
    '<div class="validation-label">Erreur de validation</div>' +
    `<div class="validation-desc">${REASON_LABELS[reason]}${details}</div>` +
    '</div>' +
    '</div>';
  generateButton.disabled = true;
  generateButton.textContent = 'Corrigez la sélection';
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

  let iconsHtml = '';
  for (const [index, icon] of summary.icons.entries()) {
    const stateClass = icon.valid ? 'success' : 'error';
    const symbol = icon.valid ? '✓' : '✕';
    const label = icon.valid
      ? `<span class="multi-validation-type">${escapeHtml(icon.type) || 'Component'} • 24×24px</span>`
      : `<span class="multi-validation-error">${escapeHtml(reasonLabel(icon.reason))}</span>`;

    iconsHtml +=
      `<div class="multi-validation-item ${stateClass}">` +
      `<div class="multi-validation-icon">${symbol}</div>` +
      '<div class="multi-validation-content">' +
      `<div class="multi-validation-name">${escapeHtml(icon.name) || `Icône ${index + 1}`}</div>` +
      label +
      '</div>' +
      '</div>';
  }

  list.innerHTML =
    `<div class="multi-validation-header">${summary.total} icônes sélectionnées • ` +
    `<strong>${summary.validCount} valides</strong> • ${summary.invalidCount} invalides</div>` +
    `<div class="multi-validation-list">${iconsHtml}</div>`;

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
  requireElement('validation-list').innerHTML =
    '<div class="validation-item error">' +
    '<div class="icon">✕</div>' +
    '<div class="validation-content">' +
    '<div class="validation-label">Erreur</div>' +
    `<div class="validation-desc">${escapeHtml(message)}</div>` +
    '</div>' +
    '</div>';
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
  requireElement('report-content').innerHTML =
    `<div class="report-item"><span class="report-icon">✓</span> ${escapeHtml(message)}</div>`;
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

function showVariablesStatus(state: '' | 'success' | 'error', html: string): void {
  const status = requireElement('variables-status');
  status.style.display = 'block';
  status.className = `variables-status${state ? ` ${state}` : ''}`;
  status.innerHTML = html;
}

function handleVariablesDetected(variables: readonly DetectedStrokeVariable[]): void {
  const status = requireElement('variables-status');
  status.style.display = 'block';

  if (variables.length > 0) {
    status.className = 'variables-status';
    status.innerHTML =
      `<strong>${variables.length} variable(s) détectée(s)</strong><br>` +
      variables
        .map((variable) => `${escapeHtml(variable.name)} → Taille ${variable.size}`)
        .join('<br>');
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

log('UI fully loaded and ready');
