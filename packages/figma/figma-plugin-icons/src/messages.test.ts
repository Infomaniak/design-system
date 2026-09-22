import { describe, expect, it } from 'vitest';

import type { DetectedStrokeVariable } from './messages.ts';
import { parsePluginMessage, parseUiMessage } from './messages.ts';
import { DEFAULT_STROKE_WEIGHTS, type StrokeConfig } from './tokens.ts';

const VARIABLE: DetectedStrokeVariable = {
  name: 'stroke/16',
  size: 16,
  collection: 'Icon',
  key: 'VariableKey:16',
};

const WRAPPED = (payload: unknown): unknown => ({ pluginMessage: payload });

describe('parsePluginMessage', () => {
  it.each([
    'validate',
    'generate',
    'cancel',
    'close',
    'get-stroke-config',
    'reset-stroke-config',
    'detect-stroke-variables',
  ] as const)('accepts the %s message (bare payload)', (type) => {
    expect(parsePluginMessage(WRAPPED({ type }))).toEqual({ type });
    expect(parsePluginMessage({ type })).toEqual({ type });
  });

  it('accepts save-stroke-config with a valid config', () => {
    expect(
      parsePluginMessage(WRAPPED({ type: 'save-stroke-config', config: DEFAULT_STROKE_WEIGHTS })),
    ).toEqual({
      type: 'save-stroke-config',
      config: DEFAULT_STROKE_WEIGHTS,
    });
  });

  it('rejects save-stroke-config with an invalid config', () => {
    expect(
      parsePluginMessage(WRAPPED({ type: 'save-stroke-config', config: { 16: 'x' } })),
    ).toBeNull();
  });

  it('accepts apply-stroke-variables with a valid variable list', () => {
    expect(
      parsePluginMessage(WRAPPED({ type: 'apply-stroke-variables', variables: [VARIABLE] })),
    ).toEqual({
      type: 'apply-stroke-variables',
      variables: [VARIABLE],
    });
  });

  it('rejects apply-stroke-variables with malformed variables', () => {
    expect(
      parsePluginMessage(WRAPPED({ type: 'apply-stroke-variables', variables: [{ name: 'x' }] })),
    ).toBeNull();
    expect(
      parsePluginMessage(WRAPPED({ type: 'apply-stroke-variables', variables: 'stroke/16' })),
    ).toBeNull();
  });

  it('rejects unknown types', () => {
    expect(parsePluginMessage(WRAPPED({ type: 'nope' }))).toBeNull();
    expect(parsePluginMessage(WRAPPED({ type: null }))).toBeNull();
  });

  it('rejects non-object inputs', () => {
    expect(parsePluginMessage(null)).toBeNull();
    expect(parsePluginMessage('validate')).toBeNull();
    expect(parsePluginMessage(42)).toBeNull();
  });

  it('unwraps non-record pluginMessage payloads', () => {
    expect(parsePluginMessage({ pluginMessage: 'validate', type: 'validate' })).toEqual({
      type: 'validate',
    });
  });
});

describe('parseUiMessage', () => {
  it('accepts validation-result messages', () => {
    const result = { name: 'eye', type: 'COMPONENT', valid: true, reason: null };
    expect(parseUiMessage({ type: 'validation-result', result })).toEqual({
      type: 'validation-result',
      result,
    });
  });

  it('accepts invalid validation-result messages with a reason and size', () => {
    const result = {
      name: 'eye',
      type: 'COMPONENT',
      valid: false,
      reason: 'not-24x24',
      currentSize: '16×16',
    };
    expect(parseUiMessage({ type: 'validation-result', result })).toEqual({
      type: 'validation-result',
      result,
    });
  });

  it('rejects malformed validation-result messages', () => {
    expect(
      parseUiMessage({ type: 'validation-result', result: { valid: true, reason: null } }),
    ).toBeNull();
    expect(
      parseUiMessage({
        type: 'validation-result',
        result: { name: 'eye', valid: true, reason: 'bogus' },
      }),
    ).toBeNull();
  });

  it('coerces optional fields of validation-result messages', () => {
    expect(
      parseUiMessage({
        type: 'validation-result',
        result: { name: 'eye', type: 42, valid: true, reason: 'no-strokes' },
      }),
    ).toEqual({
      type: 'validation-result',
      result: { name: 'eye', type: '', valid: true, reason: null, currentSize: undefined },
    });
  });

  it('accepts validation-results messages', () => {
    const summary = {
      total: 1,
      validCount: 1,
      invalidCount: 0,
      icons: [{ name: 'eye', type: 'COMPONENT', valid: true, reason: null }],
    };
    expect(parseUiMessage({ type: 'validation-results', summary })).toEqual({
      type: 'validation-results',
      summary,
    });
  });

  it('rejects malformed validation-results messages', () => {
    const base = { validCount: 1, invalidCount: 0, icons: [] };
    expect(parseUiMessage({ type: 'validation-results', summary: base })).toBeNull();
    expect(
      parseUiMessage({
        type: 'validation-results',
        summary: { total: 1, validCount: 1, invalidCount: 0, icons: ['x'] },
      }),
    ).toBeNull();
    expect(
      parseUiMessage({ type: 'validation-results', summary: { total: 1, ...base, icons: 'x' } }),
    ).toBeNull();
  });

  it('accepts progress messages', () => {
    expect(
      parseUiMessage({ type: 'progress', step: 2, total: 10, message: 'Taille 24...' }),
    ).toEqual({
      type: 'progress',
      step: 2,
      total: 10,
      message: 'Taille 24...',
    });
  });

  it('rejects malformed progress messages', () => {
    expect(parseUiMessage({ type: 'progress', step: '2', total: 10, message: 'x' })).toBeNull();
    expect(parseUiMessage({ type: 'progress', step: 2, total: 10 })).toBeNull();
  });

  it('accepts complete and error messages', () => {
    expect(parseUiMessage({ type: 'complete', message: '1 icône(s) traitée(s)' })).toEqual({
      type: 'complete',
      message: '1 icône(s) traitée(s)',
    });
    expect(parseUiMessage({ type: 'error', message: 'Aucune icône valide sélectionnée' })).toEqual({
      type: 'error',
      message: 'Aucune icône valide sélectionnée',
    });
  });

  it('rejects complete and error messages without a message', () => {
    expect(parseUiMessage({ type: 'complete' })).toBeNull();
    expect(parseUiMessage({ type: 'error' })).toBeNull();
  });

  it('accepts stroke-config messages', () => {
    expect(parseUiMessage({ type: 'stroke-config', config: DEFAULT_STROKE_WEIGHTS })).toEqual({
      type: 'stroke-config',
      config: DEFAULT_STROKE_WEIGHTS,
    });
  });

  it('rejects stroke-config messages with an invalid config', () => {
    expect(parseUiMessage({ type: 'stroke-config', config: null })).toBeNull();
  });

  it('accepts stroke-config-saved messages', () => {
    expect(parseUiMessage({ type: 'stroke-config-saved', success: true })).toEqual({
      type: 'stroke-config-saved',
      success: true,
    });
  });

  it('rejects stroke-config-saved messages without a boolean', () => {
    expect(parseUiMessage({ type: 'stroke-config-saved', success: 'yes' })).toBeNull();
  });

  it('accepts stroke-variables-detected messages', () => {
    expect(parseUiMessage({ type: 'stroke-variables-detected', variables: [VARIABLE] })).toEqual({
      type: 'stroke-variables-detected',
      variables: [VARIABLE],
    });
  });

  it('rejects stroke-variables-detected messages with malformed variables', () => {
    expect(
      parseUiMessage({ type: 'stroke-variables-detected', variables: [{ name: 'stroke/16' }] }),
    ).toBeNull();
    expect(parseUiMessage({ type: 'stroke-variables-detected', variables: 42 })).toBeNull();
  });

  it('accepts stroke-variables-applied messages', () => {
    const config: StrokeConfig = { ...DEFAULT_STROKE_WEIGHTS };
    expect(parseUiMessage({ type: 'stroke-variables-applied', success: true, config })).toEqual({
      type: 'stroke-variables-applied',
      success: true,
      config,
    });
  });

  it('rejects stroke-variables-applied messages without a config', () => {
    expect(parseUiMessage({ type: 'stroke-variables-applied', success: true })).toBeNull();
  });

  it('rejects unknown and non-object messages', () => {
    expect(parseUiMessage({ type: 'nope' })).toBeNull();
    expect(parseUiMessage(null)).toBeNull();
    expect(parseUiMessage('complete')).toBeNull();
  });
});
